import ProtectedRoute from "@/components/ProyectedRoute";
import React from "react";

const Dashboard = () => {
  return (
    
    <ProtectedRoute allowedRoles={["Admin"]}>
    <div>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        {/*to do dashboard page content here */}
      
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
