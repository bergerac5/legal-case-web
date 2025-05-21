import Navbar from '@/components/Navbar/Navbar'
import ClientList from '@/components/clients/ClientList'

const ClientsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8">
        <ClientList />
      </main>
    </div>
  )
}

export default ClientsPage