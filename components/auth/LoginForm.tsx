"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { login } from "@/services/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),// Api call
    onSuccess: (data) => {
      const { resetPassword, userId } = data;
    
      localStorage.setItem("auth_email", email);
      localStorage.setItem("user_id", userId); // Save user ID if needed
    
      if (resetPassword) {
        router.push("/reset-password");
      } else {
        router.push("/verify-otp");
      }
    },
    onError: () => {
    setErrorMessage("Invalid credentials"); // Log error and show a notify user whats happening in message
      
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    loginMutation.mutate(); // Run the login API
  };

  return (
    <div className="bg-white p-10 shadow-xl w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mt-10">Access Account</h1>
      <p className="text-center text-gray-500 mt-6 mb-6">
        Securely access your case management system
      </p>
   
        { /* login form for submitting data to backend api */}
      <form onSubmit={handleLogin} className="space-y-8">
        <Input
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          label={loginMutation.isPending ? "Log In..." : "Log In"}
          className="w-full py-2 bg-pink-800 text-white font-semibold rounded-md hover:bg-pink-900 transition cursor-pointer"
          disabled={loginMutation.isPending}
        />
      </form>
       
      {/* shaw failure error to ui for notifying user */}
      {errorMessage && (
        <p className="mt-5 text-red-600 text-center font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
