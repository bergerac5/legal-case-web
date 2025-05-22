"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Link from "next/link";
import { getAllUsers } from "@/services/user/users.api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function uuidToShortId(uuid: string, index: number): string {
    return String(index + 1).padStart(3, '0');
  }

  const { data: users = [], error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    retry: false,
  });

  useEffect(() => {
    if (error?.message.includes('Unauthorized')) {
      router.push('/login');
    }
  }, [error, router]);

  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
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
        <select className="border rounded px-2 py-1 text-sm">
          <option>All Roles</option>
          <option>Admin</option>
          <option>User</option>
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
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
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
                <td className="px-4 py-2">
                  <Button 
                    className="bg-rose-300 hover:bg-rose-400"
                    label="View"
                    onClick={() => handleViewProfile(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}