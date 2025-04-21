import PasswordForm from "@/components/password/PasswordForm";
import Button from "@/components/UI/Button";


export default function ProfilePage() {
    return (
        <div className="flex flex-col md:flex-row justify-between gap-12 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            {/* Profile Section - takes about 40% width */}
            <div className="w-full md:w-2/5">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
                    <div className="space-y-2">
                        <p className="text-gray-700">John Doe</p>
                        <p className="text-gray-700">birakarama5@gmail.com</p>
                        <p className="text-gray-700">+1 234 567 890</p>
                    </div>
                </div>
                <Button
                    type="button"
                    label="Edit"
                    className="w-full md:w-auto py-2 px-6 bg-pink-800 text-white font-semibold rounded-md hover:bg-pink-900 transition cursor-pointer"
                />
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
    );
}