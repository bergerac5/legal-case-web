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

interface AddHearingFormProps {
  caseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

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

export function AddHearingForm({
  caseId,
  onSuccess,
  onCancel,
}: AddHearingFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
  } = useForm<HearingFormData>({
    resolver: zodResolver(hearingSchema),
  });

  const createHearingMutation = useMutation({
    mutationFn: hearingAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-hearings", caseId] });
      toast.success("Hearing created successfully");
      onSuccess?.();
      router.push(`/cases/view/${caseId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create hearing");
    },
  });

  const onSubmit = async (data: HearingFormData) => {
    if (createHearingMutation.isPending) return;
    
    try {
      await createHearingMutation.mutateAsync({
        case_id: caseId,
        start_time: new Date(`${format(data.date, "yyyy-MM-dd")}T${data.startTime}:00`),
        end_time: new Date(`${format(data.date, "yyyy-MM-dd")}T${data.endTime}:00`),
        location: data.location,
        notes: data.notes,
      });
    } catch (error) {
      console.error("Error creating hearing:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Schedule New Hearing</h1>
          <p className="text-gray-500">Add hearing details for this case</p>

          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/cases/view/${caseId}`)}
              label="Back"
              variant="outline"
              icon={<ArrowLeft className="h-4 w-4" />}
            />
          </div>
        </div>
        {onCancel && (
          <Button
            onClick={onCancel}
            label="Cancel"
            variant="outline"
            icon={<ArrowLeft className="h-4 w-4" />}
          />
        )}
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
                          onSelect={(date) => {
                            field.onChange(date);
                            trigger("date");
                          }}
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
              reset();
              onCancel?.();
            }}
            label="Cancel"
            variant="outline"
            disabled={createHearingMutation.isPending}
          />
          <Button
            type="submit"
            label={
              createHearingMutation.isPending
                ? "Scheduling..."
                : "Schedule Hearing"
            }
            variant="primary"
            icon={
              createHearingMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : undefined
            }
            disabled={createHearingMutation.isPending}
          />
        </div>
      </form>
    </div>
  );
}