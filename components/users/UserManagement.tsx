"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Link from "next/link";
import { getAllUsers } from "@/services/user/users.api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/userType";
import { toast } from "react-hot-toast";
import { KeyRound, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { adminResetUserPassword } from "@/services/password/password.api";


export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All Roles");
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  function uuidToShortId(uuid: string, index: number): string {
    return String(index + 1).padStart(3, '0');
  }

  // Format role for display
  const formatRole = (role?: Role) => {
    if (!role?.name) return 'N/A';
    return role.name.charAt(0).toUpperCase() + role.name.slice(1).toLowerCase();
  };

  const { 
    data: users = [], 
    error, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    retry: false,
  });

  useEffect(() => {
    if (error?.message.includes('Unauthorized')) {
      router.push('/login');
    }
  }, [error, router]);

 
  // Extract unique roles from users for filter dropdown
  const availableRoles = Array.from(
    new Set(
      users.flatMap(user => 
        user.role?.name ? [user.role.name] : []
      )
    )
  ).filter(Boolean);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || user.role?.name === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleResetPassword = async (email: string) => {
    setResettingUser(email);
    try {
      await toast.promise(
        adminResetUserPassword(token!, email),
        {
          loading: `Resetting password for ${email}...`,
          success: `Password reset initiated for ${email}`,
          error: (err) => `Error resetting password: ${err.message}`
        }
      );
      refetch();
    } finally {
      setResettingUser(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Link href="/add-user">
          <Button className="bg-rose-400 hover:bg-rose-500" label="+ Add User" />
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm">Filter by:</label>
        <select 
          className="border rounded px-2 py-1 text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All Roles">All Roles</option>
          {availableRoles.map(role => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <Input
            placeholder="Search user..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-600">Error loading users: {String(error)}</p>}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Avatar</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{uuidToShortId(user.id, index)}</td>
                <td className="px-4 py-2">
                  <Image
                    src="/avatars/john.jpg"
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{formatRole(user.role)}</td>
                <td className="px-4 py-2">
                  
                  <button
                    onClick={() => handleResetPassword(user.email)}
                    disabled={resettingUser === user.email}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Reset Password"
                  >
                    {resettingUser === user.email ? (
                      <span className="animate-spin">↻</span>
                    ) : (
                      <KeyRound size={18} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}