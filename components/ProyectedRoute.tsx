// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/context/AuthContex";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[]; // example: ["admin", "lawyer"]
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Not logged in
    } else if (!allowedRoles.includes(user.role)) {
      router.push("/unauthorized"); // Logged in but role not allowed
    }
  }, [user, allowedRoles, router]);

  return <>{children}</>;
}
