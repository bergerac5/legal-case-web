import PropertyClaimDetails from '@/components/Claim/Property/PropertyClaimDetails'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'

const SinglePropertyClaimPage = () => {
  return (
    <div>
           <div>
          <Navbar/>
            <PropertyClaimDetails/>
        </div>
        </div>
  )
}

export default SinglePropertyClaimPage