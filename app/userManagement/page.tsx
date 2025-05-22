import Navbar from "@/components/Navbar/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import UserManagement from "@/components/users/UserManagement"

const UserManagementPage= () =>{
    return(
        <ProtectedRoute allowedRoles={["Admin","Lawyer"]}>
            <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto py-8">
                <UserManagement/>
            </main>
        </div>
        </ProtectedRoute>
        
    )
}

export default UserManagementPage