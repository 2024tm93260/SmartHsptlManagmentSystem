import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Loader2,
  User,
  Edit,
  Upload,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  adminGetProfile,
  adminUpdateProfile,
  adminUpdateProfilePic,
} from "@/services/adminApi";

const AdminUpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin, loading, error } = useSelector((state) => state.admin || {});

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchProfile = () => {
    dispatch(adminGetProfile());
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (admin) {
      reset({
        adminname: admin.adminname,
        email: admin.email,
        phonenumber: admin.phonenumber,
      });
      setProfilePicPreview(admin.profilepicture);
    }
  }, [admin, reset]);

  useEffect(() => {
    if (profilePicFile) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(profilePicFile);
    }
  }, [profilePicFile]);


  const onSubmit = async (data) => {
    try {
      const res = await dispatch(adminUpdateProfile(data));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Profile updated successfully!");
        fetchProfile();
      } else {
        toast.error(res.payload?.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };


  const onPictureSubmit = async () => {
    if (!profilePicFile) return toast.error("Please select a file first");

    const formData = new FormData();
    formData.append("profilepicture", profilePicFile);

    try {
      const res = await dispatch(adminUpdateProfilePic(formData));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Profile photo updated!");
        fetchProfile();
        setProfilePicFile(null);
      } else {
        toast.error(res.payload?.message || "Could not update picture");
      }
    } catch {
      toast.error("Upload error!");
    }
  };


  if (loading && !admin) {
    return (
      <div className="min-h-screen admin-page-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }


  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen admin-page-gradient py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/profile")}
            className="mb-6 gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="admin-accent-gradient text-white mb-4">
              <Edit className="w-3 h-3 mr-1" />
              Update Profile
            </Badge>

            <h1 className="text-4xl font-bold text-foreground mb-4">
              Edit Admin Profile
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Update your personal information and profile photo.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* --------------------------- LEFT COLUMN --------------------------- */}
            <div className="space-y-6">

              {/* Profile Picture */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-primary" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <img
                      src={profilePicPreview || "/placeholder-user.png"}
                      className="w-32 h-32 rounded-full border-4 border-border shadow-lg object-cover"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePicFile(e.target.files[0])}
                      className="mt-4 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-muted file:text-primary hover:file:bg-muted/80"
                    />

                    {profilePicFile && (
                      <Button
                        onClick={onPictureSubmit}
                        className="w-full mt-3 admin-accent-gradient hover:opacity-90"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Picture
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Admin Username (Read Only) */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Admin Username</CardTitle>
                  <CardDescription>This cannot be changed</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="px-4 py-2 bg-muted text-foreground font-semibold">
                    {admin?.adminusername}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* -------------------------- RIGHT COLUMN --------------------------- */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Edit className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your name, email, contact number, etc.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          {...register("adminname", {
                            required: "Name is required",
                          })}
                          className={errors.adminname ? "border-red-500" : ""}
                        />
                        {errors.adminname && (
                          <p className="text-red-500 text-xs">
                            {errors.adminname.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                          })}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input
                        type="tel"
                        {...register("phonenumber", {
                          required: "Phone number is required",
                        })}
                        className={errors.phonenumber ? "border-red-500" : ""}
                      />
                      {errors.phonenumber && (
                        <p className="text-red-500 text-xs">
                          {errors.phonenumber.message}
                        </p>
                      )}
                    </div>

                    {/* Created Date (read-only) */}
                    <div className="space-y-2">
                      <Label>Joined On</Label>
                      <Input
                        disabled
                        value={new Date(admin?.createdAt).toLocaleDateString()}
                      />
                    </div>

                    {/* Error Section */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>
                          {error?.message || "Error updating profile"}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 admin-accent-gradient text-primary-foreground hover:opacity-90"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Update Profile
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/profile")}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>

                  </form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUpdateProfile;
