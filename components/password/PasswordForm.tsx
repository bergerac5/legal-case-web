"use client";

import { useState } from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { changePasswordBeforeExpire } from "@/services/password/password.api";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      await changePasswordBeforeExpire(
        "birakarama5@gmail.com", // Replace with dynamic user email if available
        currentPassword,
        newPassword,
        confirmPassword
      );

      setIsSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
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
      setPasswordStrength("Weak");
    } else if (value.length < 13 || !/[!@#$%^&*]/.test(value)) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700" htmlFor="currentPassword">
          Current Password
        </label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
          >
            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* New Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">
          New Password
        </label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            placeholder="Enter new password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordStrength && (
          <p
            className={`text-xs mt-1 ${passwordStrength === "Weak"
                ? "text-red-500"
                : passwordStrength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
          >
            Password strength:{" "}
            <span className="font-medium">{passwordStrength}</span>
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          label={isLoading ? "Processing..." : "Save changes"}
          className="w-full md:w-auto py-2 px-6 bg-pink-800 text-white font-semibold rounded-md hover:bg-pink-900 transition cursor-pointer"
          disabled={isLoading}
        />
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Password changed successfully
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}