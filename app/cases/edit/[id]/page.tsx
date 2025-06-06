import CaseEditForm from "@/components/case/editCase"
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditCasePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute allowedRoles={["Lawyer"]}>
      <div className="container mx-auto px-4 py-8">
        <CaseEditForm caseId={params.id} />
      </div>
    </ProtectedRoute>

  );
}