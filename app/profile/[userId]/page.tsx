"use client";
import { useParams } from "next/navigation";
import PasswordForm from "@/components/password/PasswordForm";
import ProfileCard from "@/components/profile-management/profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext"; // Fixed typo

export default function ProfilePage() {
    const params = useParams();
    const userId = params.userId as string;
    const { user } = useAuth();
    
    const isOwnProfile = user?.sub === userId;

    return (
        <ProtectedRoute 
            allowedRoles={[]}
            ownerAccess={true}
            ownerId={userId}
            redirectUnauthorized="/dashboard"
        >
            <Navbar />
            <div className="flex flex-col md:flex-row justify-between gap-12 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
                <div className="w-full md:w-2/5">
                    {isOwnProfile ? (
                        <ProfileCard userId={userId} />
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">You can only view your own profile</p>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-3/5">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
                    <p className="text-gray-600 mb-6">
                        In hac habitasse platea dictumst. Proin faucibus arcu quis ante scelerisque,
                        vitae interdum nisi molestie. Ut at lacus nec leo facilisis aliquam.
                        Cras condimentum fringilla egestas.
                    </p>
                    {isOwnProfile && <PasswordForm />}
                </div>
            </div>
        </ProtectedRoute>
    );
}