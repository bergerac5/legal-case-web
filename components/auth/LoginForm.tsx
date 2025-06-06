"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { login } from "@/services/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: () => login(email, password), // Api call
    onSuccess: (data) => {
  const { mustReset, userId } = data;

  localStorage.setItem("auth_email", email);
  localStorage.setItem("user_id", userId); // save user ID to local storage

  if (mustReset) {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="bg-white p-10 shadow-xl w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mt-10">Access Account</h1>
      <p className="text-center text-gray-500 mt-6 mb-6">
        Securely access your case management system
      </p>

      {/* login form for submitting data to backend api */}
      <form onSubmit={handleLogin} className="space-y-8">
        <Input
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Button
          type="submit"
          label={loginMutation.isPending ? "Log In..." : "Log In"}
          variant="primary"
          size="md"
          className="w-full justify-center bg-pink-800 hover:bg-pink-900"
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
