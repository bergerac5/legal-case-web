import AddClientForm from "@/components/clients/AddClient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddClientPage() {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <div className="container mx-auto px-4 py-8">
        <AddClientForm />
      </div>
    </ProtectedRoute>
  );
}
