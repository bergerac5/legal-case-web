import CaseRegistrationForm from "@/components/case/addCase";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddCasePage() {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <div className="container mx-auto px-4 py-8">
        <CaseRegistrationForm />
      </div>
    </ProtectedRoute>
  );
}
