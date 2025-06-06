import SingleClaimDetails from '@/components/Claim/Client/SingleClaim'
import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const SinglePropertyPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer"]}>
      <div>
           <div>
          <Navbar/>
            <SingleClaimDetails/>
        </div>
        </div>
    </ProtectedRoute>
    
  )
}

export default SinglePropertyPage