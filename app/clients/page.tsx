import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import ClientList from '@/components/clients/ClientList'

const ClientsPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8">
        <ClientList />
      </main>
    </div>
    </ProtectedRoute>
    
  )
}

export default ClientsPage