import PropertiesClaim from '@/components/Claim/Property/AllPropertyClaim'
import Navbar from '@/components/Navbar/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const PropertyClaimPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <div>
        <div>
        <Navbar/>
        <PropertiesClaim/>
        </div>
    </div>
    </ProtectedRoute>
    
  )
}

export default PropertyClaimPage