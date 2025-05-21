import Navbar from "@/components/navbar/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const Dashboard = () => {
  return (
    
    <ProtectedRoute allowedRoles={["Admin","Lawyer"]}>
    <div>
      <div>
        <Navbar/>
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        {/*to do dashboard page content here */}
      
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
