"use client";
import { useParams } from "next/navigation";
import PasswordForm from "@/components/password/PasswordForm";
import ProfileCard from "@/components/profile-management/profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar/Navbar";

export default function ProfilePage() {
    const params = useParams();
    const userId = params.userId as string; 
    console.log("ProfilePage userId:", userId);


    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <Navbar></Navbar>
            <div className="flex flex-col md:flex-row justify-between gap-12 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            {/* Profile Section - takes about 40% width */}
            <div className="w-full md:w-2/5">
                <ProfileCard userId={userId} />
            </div>

            {/* Password Section - takes about 55% width */}
            <div className="w-full md:w-3/5">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
                <p className="text-gray-600 mb-6">
                    In hac habitasse platea dictumst. Proin faucibus arcu quis ante scelerisque,
                    vitae interdum nisi molestie. Ut at lacus nec leo facilisis aliquam.
                    Cras condimentum fringilla egestas.
                </p>
                <PasswordForm />
            </div>
        </div>
        </ProtectedRoute>
        
    );
}