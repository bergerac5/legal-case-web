import CaseEditForm from "@/components/case/editCase"

export default function EditCasePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <CaseEditForm caseId={params.id} />
    </div>
  );
}