import { AddHearingForm } from "@/components/hearing/addHearing";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddHearingPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute allowedRoles={["Lawyer"]}>
      <div className="container mx-auto px-4 py-8">
        <AddHearingForm caseId={params.id} />
      </div>
    </ProtectedRoute>
  );
}
