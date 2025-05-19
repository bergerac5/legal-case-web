import EditClientForm from "@/components/clients/EditClient";

export default function EditClientPage({ params }: { params: { id: string } }) {
  return <EditClientForm clientId={params.id} />;
}