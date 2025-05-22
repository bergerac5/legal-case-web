import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import AddUserForm from '@/components/users/AddUser'

const AddUserPage= () =>{
    return(
        <ProtectedRoute allowedRoles={["Admin"]}>
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto py-8">
                <AddUserForm/>
            </main>
        </div>
        </ProtectedRoute>
    )

}

export default AddUserPage