import Navbar from "@/components/Navbar/Navbar"
import UserManagement from "@/components/users/UserManagement"

const UserManagementPage= () =>{
    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto py-8">
                <UserManagement/>
            </main>
        </div>
    )
}

export default UserManagementPage