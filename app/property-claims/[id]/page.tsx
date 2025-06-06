import PropertyClaimDetails from '@/components/Claim/Property/PropertyClaimDetails'
import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const SinglePropertyClaimPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <div>
           <div>
          <Navbar/>
            <PropertyClaimDetails/>
        </div>
        </div>
    </ProtectedRoute>
    
  )
}

export default SinglePropertyClaimPage