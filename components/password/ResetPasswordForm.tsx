"use client";

import { useState } from 'react';
import Button from "@/components/UI/Button";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Validation
    if (!currentPassword) {
      newErrors.currentPassword = 'Required';
      valid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = 'Required';
      valid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      valid = false;
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'Must be different from current password';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Required';
      valid = false;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      // Submit logic would go here
      setIsSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    // Enhanced password strength check
    if (value.length === 0) {
      setPasswordStrength("");
    } else if (value.length < 8) {
      setPasswordStrength("Weak - must be at least 8 characters");
    } else if (value.length < 12 || !/[!@#$%^&*]/.test(value)) {
      setPasswordStrength("Medium - could be stronger");
    } else {
      setPasswordStrength("Strong");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              className={`w-full px-3 py-2 pr-10 border rounded-md ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              className={`w-full px-3 py-2 pr-10 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword ? (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          ) : (
            <>
              <p className="mt-1 text-sm text-gray-500">
                Your new password must be different from previous passwords
              </p>
              {passwordStrength && (
                <p className={`mt-1 text-sm ${passwordStrength.includes("Weak") ? "text-red-600" :
                    passwordStrength.includes("Medium") ? "text-yellow-600" :
                      "text-green-600"
                  }`}>
                  Password Strength: {passwordStrength}
                </p>
              )}
            </>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full px-3 py-2 pr-10 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          label="Reset Password"
          className="w-full py-2 bg-pink-800 text-white font-semibold rounded-md hover:bg-pink-900 transition cursor-pointer"
        />

        {isSuccess && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md text-center">
            Password reset successfully
          </div>
        )}
      </form>
    </div>
  );
}