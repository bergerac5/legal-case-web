"use client";

import { useState, useEffect } from "react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { verifyOtp, resendOtp } from "@/services/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("auth_email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/login");
    }
  }, []);

  // Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: () => verifyOtp(email, otp),//Api call
    onSuccess: (data) => {
      if (data.resetPassword || data.mustResetPassword) {
        router.push("/reset-password");
      } else {
        router.push("/dashboard");
      }
    },
    onError: () => {
      setMessage("Invalid or expired OTP.");
    },
  });

  // Mutation for resending OTP
  const resendOtpMutation = useMutation({
    mutationFn: () => resendOtp(email),
    onSuccess: () => {
      setMessage("OTP resent to your email.");
    },
    onError: () => {
      setMessage("Failed to resend OTP.");
    },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    verifyOtpMutation.mutate(); // triggers the mutation for Api call toverfy
  };

  const handleResend = () => {
    setMessage("");
    resendOtpMutation.mutate(); // triggers the mutation for Api call to resend
  };

  return (
    <div className="bg-white p-10 shadow-xl w-full max-w-md text-center">
      <h1 className="text-2xl font-bold mb-2">Verification</h1>
      <p className="text-gray-500 mt-6 mb-6">
        Please enter the one-time password (OTP) sent to your email.
      </p>

      <form onSubmit={handleVerify} className="space-y-8">
        <Input
          type="text"
          placeholder="Enter your OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="text-center"
        />
        <Button
          type="submit"
          label={verifyOtpMutation.isPending ? "Verifying..." : "Submit"}
          className="w-52 py-2 bg-pink-800 text-white font-semibold rounded-md hover:bg-pink-900 transition cursor-pointer"
          disabled={verifyOtpMutation.isPending}
        />
      </form>

      <p className="mt-4 text-sm text-gray-600">Didn&apos;t receive it?</p>
      <button
        onClick={handleResend}
        className="text-sm text-pink-800 hover:underline cursor-pointer"
        type="button"
        disabled={resendOtpMutation.isPending}
      >
        {resendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
      </button>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
}
