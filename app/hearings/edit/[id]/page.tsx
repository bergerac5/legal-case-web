
import { EditHearingForm } from "@/components/hearing/editHearing";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getHearingById } from "@/services/hearing/hearing.api";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditHearingPage({ params }: PageProps) {
  const hearing = await getHearingById(params.id);
  
  if (!hearing) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-4">
        <div className="text-red-500 text-center">Hearing not found</div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["Lawyer"]}>
      <div className="container mx-auto px-4 py-8">
      <EditHearingForm 
        hearingId={params.id} 
        caseId={hearing.case_id} 
      />
    </div>
    </ProtectedRoute>
    
  );
}