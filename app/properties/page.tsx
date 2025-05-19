import Navbar from '@/components/Navbar/NavBar'
import PropertiesPage from '@/components/property/PropertiesList'
import React from 'react'

const PropertiesListPage = () => {
  return (
    <div>
       <div>
      <Navbar/>
        <PropertiesPage/>
    </div>
    </div>
  )
}

export default PropertiesListPage