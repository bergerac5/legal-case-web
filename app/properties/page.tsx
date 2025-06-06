import Navbar from "@/components/Navbar/Navbar";
import PropertiesPage from "@/components/property/PropertiesList";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const PropertiesListPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Lawyer,", "Manager"]}>
      <div>
        <div>
          <Navbar />
          <PropertiesPage />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PropertiesListPage;
