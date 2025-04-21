
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Form validation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type UserFormData = z.infer<typeof userSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = (data: UserFormData) => {
    console.log("User data:", data);
    router.push("/user-management");
  };

  const handleDelete = () => {
    console.log("User deleted");
    router.push("/user-management");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add User</h1>
        <Link href="/">
          <Button variant="outline" className="text-gray-700 bg-rose-500">
            Back to Users
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User Information Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            User Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-600">
                - Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="mt-1 border-gray-300"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-600">
                - Email
              </Label>
              <Input
                id="email"
                placeholder="johndoe@gmail.com"
                className="mt-1 border-gray-300"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-600">
                - Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 012-3456"
                className="mt-1 border-gray-300"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </section>
        {/* Divider */}
        <hr className="border-gray-200 my-6" />

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="space-x-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 bg-rose-500"
              onClick={() => router.push("/user-management")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-rose-500 hover:bg-red-600 text-white"
            >
              Save
            </Button>
          </div>
          <Button
            type="button"
            variant="destructive"
            className="text-white bg-rose-500"
            onClick={handleDelete}
          >
            Delete User
          </Button>
        </div>
      </form>
    </div>
  );
}
