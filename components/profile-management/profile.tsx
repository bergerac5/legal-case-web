"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "@/services/user/users.api";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useAuth } from "@/context/AuthContex";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: {
    id: string;
    name: string;
  };
}

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileCard({ userId }: { userId: string }) {
  const { isAuthorized } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthorized(["Admin"])) {
      router.push("/unauthorized");
    }
  }, [isAuthorized, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    retry: false,
  });

  useEffect(() => {
    if (user) {
      console.log("Resetting form with:", user);
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => updateUser(userId, data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
      <span className="ml-2">Loading profile...</span>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      Error loading profile: {error.message}
      <button onClick={() => window.location.reload()} className="ml-2 text-blue-500">
        Retry
      </button>
    </div>;
  }

  if (!user) {
    return <div className="p-4">User data not available</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <Input
            type="text"
            disabled={!isEditing}
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <Input
            type="email"
            disabled={!isEditing}
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <Input
            type="tel"
            disabled={!isEditing}
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Buttons */}
        {isEditing ? (
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              icon={
                updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : undefined
              }
              label={updateMutation.isPending ? "Saving..." : "Save"}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            />
            <Button
              type="button"
              label="Cancel"
              onClick={() => {
                reset();
                setIsEditing(false);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black"
            />
          </div>
        ) : (
          <Button
            type="button"
            label="Edit Profile"
            onClick={() => setIsEditing(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          />
        )}
      </form>
    </div>
  );
}
