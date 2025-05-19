"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import Button from "@/components/UI/Button";
import { Calendar as CalendarComponent } from "@/components/UI/Calendar";
import Input from "../UI/Input";
import { Textarea } from "@/components/UI/TextArea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/Popover";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hearingAPI } from "@/services/hearing/hearing.api";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const hearingSchema = z.object({
  date: z.date({
    required_error: "Hearing date is required",
    invalid_type_error: "Please select a valid date",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (!data.startTime || !data.endTime) return true;
  
  const start = new Date(`${format(data.date, "yyyy-MM-dd")}T${data.startTime}:00`);
  const end = new Date(`${format(data.date, "yyyy-MM-dd")}T${data.endTime}:00`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type HearingFormData = z.infer<typeof hearingSchema>;

interface EditHearingFormProps {
  hearingId: string;
  caseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditHearingForm({
  hearingId,
  caseId,
  onSuccess,
  onCancel,
}: EditHearingFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { data: hearing, isLoading } = useQuery({
    queryKey: ["hearing", hearingId],
    queryFn: () => hearingAPI.getById(hearingId),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<HearingFormData>({
    resolver: zodResolver(hearingSchema),
  });

  // Set form values when hearing data loads
  useEffect(() => {
    if (hearing) {
      reset({
        date: new Date(hearing.start_time),
        startTime: format(new Date(hearing.start_time), "HH:mm"),
        endTime: format(new Date(hearing.end_time), "HH:mm"),
        location: hearing.location,
        notes: hearing.notes,
      });
    }
  }, [hearing, reset]);

  const updateHearingMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: HearingFormData }) =>
      hearingAPI.update(id, {
        start_time: new Date(`${format(dto.date, "yyyy-MM-dd")}T${dto.startTime}:00`),
        end_time: new Date(`${format(dto.date, "yyyy-MM-dd")}T${dto.endTime}:00`),
        location: dto.location,
        notes: dto.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-hearings", caseId] });
      toast.success("Hearing updated successfully");
      onSuccess?.();
      router.push(`/cases/view/${caseId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hearing");
    },
  });

  const onSubmit = async (data: HearingFormData) => {
    if (updateHearingMutation.isPending) return;
    
    try {
      await updateHearingMutation.mutateAsync({
        id: hearingId,
        dto: data,
      });
    } catch (error) {
      console.error("Error updating hearing:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading hearing data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Hearing</h1>
          <p className="text-gray-500">Update hearing details for this case</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Hearing Details Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Hearing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Hearing Date*
                </label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          icon={<Calendar className="h-4 w-4 mr-2" />}
                          label={field.value ? format(field.value, "PPP") : "Select a date"}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              {/* Time Inputs */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time*
                </label>
                <div className="flex gap-2">
                  <div className="w-full">
                    <Input
                      type="time"
                      {...register("startTime")}
                      className="w-full"
                      placeholder="Start time"
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <Input
                      type="time"
                      {...register("endTime")}
                      className="w-full"
                      placeholder="End time"
                    />
                    {errors.endTime && (
                      <p className="mt-1 text-sm text-red-500">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              {...register("location")}
              placeholder="Enter hearing location (e.g., Courtroom 5A or Zoom link)"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </label>
            <Textarea
              {...register("notes")}
              placeholder="Enter any additional information about the hearing"
              rows={4}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => {
              onCancel?.();
              router.push(`/cases/view/${caseId}`);
            }}
            label="Cancel"
            variant="outline"
            disabled={updateHearingMutation.isPending}
          />
          <Button
            type="submit"
            label={
              updateHearingMutation.isPending
                ? "Updating..."
                : "Update Hearing"
            }
            variant="primary"
            icon={
              updateHearingMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : undefined
            }
            disabled={updateHearingMutation.isPending}
          />
        </div>
      </form>
    </div>
  );
}