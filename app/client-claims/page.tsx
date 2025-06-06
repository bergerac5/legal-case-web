import ClientsClaims from '@/components/Claim/Client/AllClientClaim'
import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const PropertyClaimPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer",' Manager']}>
      <div>
        <div>
        <Navbar/>
        <ClientsClaims/>
        </div>
    </div>
    </ProtectedRoute>

  )
}

export default PropertyClaimPage