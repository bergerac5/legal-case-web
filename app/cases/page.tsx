import Navbar from '@/components/Navbar/Navbar'
import CaseList from "@/components/case/CaseList"

const CasesPage= () =>{
    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto py-8">
                <CaseList/>
            </main>
        </div>
    )
}

export default CasesPage