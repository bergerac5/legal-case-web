import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import CaseList from "@/components/case/CaseList"

const CasesPage= () =>{
    return(
        <ProtectedRoute allowedRoles={["Manager","Lawyer"]}>
            <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto py-8">
                <CaseList/>
            </main>
        </div>
        </ProtectedRoute>
        
    )
}

export default CasesPage