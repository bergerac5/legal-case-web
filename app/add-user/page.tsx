import Navbar from '@/components/Navbar/Navbar'
import AddUserForm from '@/components/users/AddUser'

const AddUserPage= () =>{
    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto py-8">
                <AddUserForm/>
            </main>
        </div>
    )
}

export default AddUserPage