"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientById, updateClient } from "@/services/client/clients.api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { AxiosError } from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const clientSchema = z.object({
  names: z.string().min(1, "Name is required"),
  poc: z
    .string()
    .min(1, "Point of Contact is required")
    .regex(/^[0-9]+$/, "POC must contain only numbers"),
  phoneNumber: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),
  address: z.string().min(1, "Address is required"),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function EditClientForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  // Fetch existing client data
  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId),
  });

  // Reset form when client data is loaded
  useEffect(() => {
    if (client) {
      reset({
        names: client.names,
        poc: client.poc,
        phoneNumber: client.phoneNumber,
        address: client.address,
      });
    }
  }, [client, reset]);

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientFormData }) =>
      updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });

      // Show success message
      toast.success("Client updated successfully!");

      // Delay the redirect by 1.5 seconds (1500ms)
      setTimeout(() => {
        router.push("/clients");
      }, 1500);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 409) {
        setError("poc", {
          type: "manual",
          message:
            error.response?.data?.message ||
            "A client with this POC already exists",
        });
      } else {
        console.error("Error updating client:", error);
      }
    },
  });

  const onSubmit = (data: ClientFormData) => {
    mutation.mutate({ id: clientId, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading client data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Client</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Name *
          </label>
          <Input
            id="names"
            type="text"
            {...register("names")}
            className={`w-full ${
              errors.names ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.names && (
            <p className="mt-1 text-sm text-red-600">{errors.names.message}</p>
          )}
        </div>

        {/* POC Field */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="poc"
          >
            Point of Contact (POC) *
          </label>
          <Input
            id="poc"
            type="text"
            readOnly
            {...register("poc")}
            className={`w-full ${
              errors.poc ? "border-red-500" : "border-gray-300"
            } bg-gray-100 cursor-not-allowed`}
          />
          {errors.poc && (
            <p className="mt-1 text-sm text-red-600">{errors.poc.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="phone"
          >
            Phone *
          </label>
          <Input
            id="phone"
            type="tel"
            {...register("phoneNumber")}
            className={`w-full ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="address"
          >
            Address *
          </label>
          <Input
            id="address"
            type="text"
            {...register("address")}
            className={`w-full ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
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
            label={mutation.isPending ? "Saving..." : "Save Changes"}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            icon={
              mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : undefined
            }
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
                  {mutation.error.response?.data?.message ||
                    "Failed to update client. Please try again."}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
