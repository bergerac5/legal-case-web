import EditClientForm from "@/components/clients/EditClient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditClientPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <EditClientForm clientId={params.id} />
    </ProtectedRoute>
  
);
}