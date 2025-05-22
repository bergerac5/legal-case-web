import InsuranceClaim from '@/components/insuranceclaim/insuranceManagement'
import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'

const InsuranceManagementPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin","Lawyer"]}>
      <div>
      <Navbar/> 
        <div>
        <InsuranceClaim/>
      </div>
    </div>
    </ProtectedRoute>
    
  )
}

export default InsuranceManagementPage