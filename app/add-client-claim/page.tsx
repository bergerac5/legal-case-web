import AddClientClaim from '@/components/Claim/Client/AddClientClaim'
import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const AddClientClaimPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <div>
         <div>
        <Navbar/>
          <AddClientClaim/>
      </div>
      </div>
    </ProtectedRoute>
      
    )
}

export default AddClientClaimPage