import InsuranceClaim from '@/components/insuranceclaim/insuranceManagement'
import Navbar from '@/components/Navbar/NavBar'

const InsuranceManagementPage = () => {
  return (
    <div>
      <Navbar/> 
        <div>
        <InsuranceClaim/>
      </div>
    </div>
  )
}

export default InsuranceManagementPage