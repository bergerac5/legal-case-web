"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUser, getAllRoles } from "@/services/user/users.api";

// Updated validation schema (no password fields)
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AddUserForm() {
  const router = useRouter();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await getAllRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to load roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  const onSubmit = async (data: UserFormData) => {
  setIsSubmitting(true);
  try {
    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role_id: data.role,
    };

    await createUser(userData);
    alert("User created successfully!");
    router.push("/userManagement");
  } catch (error) {
    console.error("Error creating user:", error);
    alert(error instanceof Error ? error.message : "Failed to create user");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add User</h1>
        <Link href="/user-management">
          <Button
            variant="outline"
            className="text-gray-700 bg-rose-500"
            label="Back to Users"
          />
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            User Information
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                className="mt-1 border-gray-300"
                {...register("name")}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                placeholder="johndoe@gmail.com"
                className="mt-1 border-gray-300"
                type="email"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone"
                placeholder="+1 (555) 012-3456"
                className="mt-1 border-gray-300"
                {...register("phone")}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md"
                {...register("role")}
                disabled={loadingRoles}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>
          </div>
        </section>

        <div className="flex justify-between">
          <div className="space-x-3">
            <Button
              type="button"
              variant="outline"
              label="Cancel"
              className="border-gray-300 text-gray-700 bg-rose-500"
              onClick={() => router.push("/userManagement")}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="bg-rose-500 hover:bg-red-600 text-white"
              label={isSubmitting ? "Creating..." : "Create User"}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
