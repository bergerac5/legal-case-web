import InsuranceClaim from '@/components/insuranceclaim/insuranceManagement'
import Navbar from '@/components/navbar/Navbar'

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