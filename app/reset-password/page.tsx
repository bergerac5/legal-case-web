import ResetPasswordForm from '@/components/password/ResetPasswordForm'
import backgroundPic from '../../assets/BgPc.jpeg';
import React from 'react'

const ResetPassword = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
  <img
    src={backgroundPic.src}
    alt="Background"
    className="absolute top-0 left-0 w-full h-full object-fill"
  />
  <div className="relative z-10 flex items-center justify-center h-full">
    <ResetPasswordForm/>
  </div>
</div>

  )
}

export default ResetPassword