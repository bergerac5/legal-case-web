import { AddHearingForm } from "@/components/hearing/addHearing";

export default function AddHearingPage ({ params }: { params: { id: string } }){
    return(
        <div className="container mx-auto px-4 py-8">
            <AddHearingForm caseId={params.id}/>
        </div>
    )
}