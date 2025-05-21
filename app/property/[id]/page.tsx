import Navbar from '@/components/navbar/Navbar'
import PropertyDetails from '@/components/property/SingleProperty'
import React from 'react'

const SinglePropertyPage = () => {
  return (
    <div>
           <div>
          <Navbar/>
            <PropertyDetails/>
        </div>
        </div>
  )
}

export default SinglePropertyPage