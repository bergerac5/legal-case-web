// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/context/AuthContex";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [user, allowedRoles, router, isLoading]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // while redirect happens
  }

  return <>{children}</>;
}