import Navbar from '@/components/Navbar/Navbar'
import AddProperty from '@/components/property/AddProperty'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const AddPropertyPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer", "Manager"]}>
      <div>
         <div>
        <Navbar/>
          <AddProperty/>
      </div>
      </div>
    </ProtectedRoute>      
    )
}

export default AddPropertyPage