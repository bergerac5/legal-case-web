"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import logo from '../../assets/logo.png';
import profilePic from '../../assets/profile.png';
import { useAuth } from "@/context/AuthContext"; 

const navItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard",
    allowedRoles: ["Admin", "Lawyer",'Manager'] 
  },
  { 
    label: "User Management", 
    href: "/userManagement",
    allowedRoles: ["Admin"] 
  },
  { 
    label: "Properties", 
    href: "/properties",
    allowedRoles: ["Lawyer", "Manager"] 
  },
  { 
    label: "Insurance Management", 
    href: "/insurance-management",
    allowedRoles: ["Manager"]  
  },
  { 
    label: "Cases", 
    href: "/cases",
    allowedRoles: ["Manager","Lawyer"]  
  },
  { 
    label: "Clients", 
    href: "/clients",
    allowedRoles: ["Manager","Lawyer"] 
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthorized, logout } = useAuth();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!user) return false;
    return isAuthorized(item.allowedRoles);
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md flex items-center justify-between px-8 py-4">
      {/* Logo & Menu */}
      <div className="flex items-center space-x-10">
        <Image src={logo} alt="REG Logo" width={90} height={40} />
        
        {user && (
          <ul className="flex space-x-6 text-sm font-medium">
            {filteredNavItems.map((item) => (
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
        )}
      </div>

      {user && (
        <div className="flex items-center space-x-6">
          <Search className="text-gray-600 hover:text-gray-800" size={18} />
          <Settings className="text-gray-600 hover:text-gray-800" size={18} />
          <Bell className="text-gray-600 hover:text-gray-800" size={18} />
          <div className="flex items-center space-x-2">
            <Link href={`/profile/${user.sub}`}>
              <Image
                src={profilePic}
                alt="User"
                width={36}
                height={36}
                className="rounded-full cursor-pointer hover:ring-2 hover:ring-pink-500 transition-all"
              />
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-pink-700 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}