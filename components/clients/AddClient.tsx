"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/client/clients.api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { AxiosError } from "axios";

// Define validation schema
const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  poc: z.string().min(1, "Point of Contact is required").regex(/^[0-9]+$/, "POC must contain only numbers"),
  phone: z.string().min(1, "Phone is required").regex(/^[0-9]+$/, "Phone must contain only numbers"),
  address: z.string().min(1, "Address is required"),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function AddClientForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      router.push("/clients");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 409) {
        // Handle POC conflict error
        setError("poc", {
          type: "manual",
          message: error.response?.data?.message || "A client with this POC already exists",
        });
      } else {
        // Generic error handling
        console.error("Error creating client:", error);
      }
    },
  });

  const onSubmit = (data: ClientFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Name *
          </label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* POC Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="poc">
            Point of Contact (POC) *
          </label>
          <Input
            id="poc"
            type="text"
            {...register("poc")}
            className={`w-full ${errors.poc ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.poc && (
            <p className="mt-1 text-sm text-red-600">{errors.poc.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
            Phone *
          </label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            className={`w-full ${errors.phone ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="address">
            Address *
          </label>
          <Input
            id="address"
            type="text"
            {...register("address")}
            className={`w-full ${errors.address ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={() => router.push("/clients")}
            label="Cancel"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          />
          <Button
            type="submit"
            label={mutation.isPending ? "Processing..." : "Add Client"}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            icon={mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            disabled={mutation.isPending}
          />
        </div>

        {/* Global Error Message */}
        {mutation.isError && mutation.error.response?.status !== 409 && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {mutation.error.response?.data?.message || "Failed to create client. Please try again."}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}