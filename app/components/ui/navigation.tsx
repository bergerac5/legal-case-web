"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings } from "lucide-react";
import Image from "next/image";


const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "User Management", href: "/" },
  { label: "Profile Management", href: "/profile-management" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-8 py-4">
      {/* Logo + Menu */}
      <div className="flex items-center space-x-10">
        <Image src="/logo.jpg" alt="REG Logo" width={90} height={40} />
        <ul className="flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`hover:text-pink-700 transition ${
                  pathname === item.href
                    ? "text-pink-700 border-b-2 border-pink-700 pb-1"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        <Search className="text-gray-600 hover:text-gray-800" size={18} />
        <Settings className="text-gray-600 hover:text-gray-800" size={18} />
        <Bell className="text-gray-600 hover:text-gray-800" size={18} />
        
        {/** profile picture */}
        <Image
          src="/avatars/john.jpg"
          alt="User"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </nav>
  );
}