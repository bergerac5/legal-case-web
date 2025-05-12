"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, FileText, Loader2, ArrowLeft } from "lucide-react";
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

export function AddHearingForm({ caseId, onSuccess, onCancel }: AddHearingFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const createHearingMutation = useMutation({
    mutationFn: hearingAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-hearings", caseId] });
      toast.success("Hearing created successfully");
      onSuccess?.();
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create hearing");
    },
  });

  const resetForm = () => {
    setDate(undefined);
    setStartTime("");
    setEndTime("");
    setLocation("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Please enter start and end times");
      return;
    }

    createHearingMutation.mutate({
      case_id: caseId,
      start_time: new Date(`${format(date!, "yyyy-MM-dd")}T${startTime}:00`),
      end_time: new Date(`${format(date!, "yyyy-MM-dd")}T${endTime}:00`),
      location,
      notes,
    });
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Hearing Details Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Hearing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Hearing Date*
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      label=""
                      className="w-full justify-start text-left font-normal"
                    >
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time*
                </label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full"
                    placeholder="Start time"
                  />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full"
                    placeholder="End time"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter hearing location (e.g., Courtroom 5A or Zoom link)"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional information about the hearing"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => {
              resetForm();
              onCancel?.();
            }}
            label="Cancel"
            variant="outline"
            disabled={createHearingMutation.isPending}
          />
          <Button
            type="submit"
            label={
              createHearingMutation.isPending ? "Scheduling..." : "Schedule Hearing"
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