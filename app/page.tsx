"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import Link from "next/link";

const users = [
  {
    id: "001",
    name: "John Doe",
    email: "john.doe@email.com",
    avatar: "/avatars/john.jpg",
  },
  {
    id: "002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    avatar: "/avatars/jane.jpg",
  },
  {
    id: "003",
    name: "Michael Johnson",
    email: "michael.johnson@email.com",
    avatar: "/avatars/michael.jpg",
  },
  {
    id: "004",
    name: "Emily Brown",
    email: "emily.brown@email.com",
    avatar: "/avatars/emily.jpg",
  },
  {
    id: "005",
    name: "David Wilson",
    email: "david.wilson@email.com",
    avatar: "/avatars/david.jpg",
  },
  {
    id: "006",
    name: "Sarah Miller",
    email: "sarah.miller@email.com",
    avatar: "/avatars/sarah.jpg",
  },
  {
    id: "007",
    name: "Kevin Lee",
    email: "kevin.lee@email.com",
    avatar: "/avatars/kevin.jpg",
  },
];

export default function UserManagement() {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Link href="/add-user">
          <Button className="bg-rose-400 hover:bg-rose-500">+ Add User</Button>
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <Button className="bg-rose-300 hover:bg-rose-400">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}