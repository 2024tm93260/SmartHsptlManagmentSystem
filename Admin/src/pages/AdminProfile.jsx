import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { adminGetProfile } from "@/services/adminApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Lock,
  Award,
  Building2,
} from "lucide-react";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetProfile());
  }, [dispatch]);

  if (loading || !admin) {
    return (
      <div className="min-h-screen admin-page-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-page-gradient py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                  <User className="w-8 h-8 text-primary" />
                  Admin Profile
                </CardTitle>
                <p className="text-muted-foreground">
                  View and manage your admin account details
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b">
              <div className="relative">
                <img
                  src={admin.profilepicture || "/placeholder-user.png"}
                  alt="Admin"
                  className="w-32 h-32 rounded-full border-4 border-border object-cover shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 admin-accent-gradient rounded-full p-2 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {admin.adminname}
                </h2>

                <Badge
                  variant="secondary"
                  className="mb-2 bg-muted text-primary"
                >
                  {admin.adminusername}
                </Badge>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-2">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm">{admin.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                    <p className="font-semibold text-foreground">
                      {admin.phonenumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Joined On</p>
                    <p className="font-semibold text-foreground">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {admin.role && (
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Role</p>
                      <p className="font-semibold text-foreground capitalize">
                        {admin.role}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department Access</p>
                    <p className="font-semibold text-foreground">
                      BIMS Administration
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate("/updateprofile")}
                className="flex-1 gap-2 admin-accent-gradient text-white hover:opacity-90"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>

              <Button
                onClick={() => navigate("/update-password")}
                variant="outline"
                className="flex-1 gap-2 border-primary text-primary hover:bg-muted"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminProfile;
