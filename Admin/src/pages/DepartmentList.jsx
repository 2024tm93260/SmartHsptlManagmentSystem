import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { adminGetAllDepartments } from "@/services/adminApi";
import { useNavigate } from "react-router-dom";

import AdminDepartmentCard from "@/components/custom/AdminDepartmentCard";
import { Loader2, Building2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

function AdminDepartmentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { departments, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetAllDepartments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-card">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-foreground font-medium">Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-card flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || "Failed to load departments."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-page-gradient py-12">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 admin-accent-gradient text-white"
          >
            <Building2 className="w-3 h-3 mr-1" />
            Departments
          </Badge>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Hospital Departments
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore all medical departments managed under BIMS Administration.
          </p>

          <p className="text-sm text-muted-foreground mt-3">
            Total Departments:{" "}
            <span className="font-semibold text-primary">{departments?.length || 0}</span>
          </p>
        </div>

        {/* Department Grid */}
        {departments?.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No departments available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <AdminDepartmentCard
                key={dept._id}
                dept={dept}
                onClick={() =>
                  navigate(`/departments/${dept.deptname.toLowerCase()}/doctors`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDepartmentList;
