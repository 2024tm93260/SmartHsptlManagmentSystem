import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Lock,
  Building2,
  GraduationCap,
  Briefcase,
  Stethoscope,
  Award,
  Clock,
  FileText,
  UserCircle,
  Users
} from "lucide-react";
import { getDoctorProfile } from "@/services/doctorApi";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.doctor );

  useEffect(() => {
    dispatch(getDoctorProfile());
  }, [dispatch]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen doctor-page-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen doctor-page-gradient py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header Card */}
        <Card className="shadow-xl border-0 overflow-hidden mb-8">
          <div className="doctor-accent-gradient p-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <img
                  src={profile.verificationdocument?.profilepicture || "/placeholder-user.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">Dr. {profile.doctorname}</h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                  <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                    <UserCircle className="w-3 h-3 mr-1" />
                    {profile.doctorusername}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                    <Building2 className="w-3 h-3 mr-1" />
                    {profile.department}
                  </Badge>
                  {profile.specialization && (
                    <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                      <Stethoscope className="w-3 h-3 mr-1" />
                      {profile.specialization}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Professional Stats */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Professional Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Briefcase className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-primary">{profile.experience}+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <GraduationCap className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold text-primary">{profile.qualification}</p>
                  <p className="text-sm text-muted-foreground">Qualification</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.verificationdocument?.aadhar && (
                  <a
                    href={profile.verificationdocument?.aadhar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted hover:bg-muted rounded-lg transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">Aadhar Card</p>
                    <p className="text-xs text-primary">View Document →</p>
                  </a>
                )}
                {profile.verificationdocument?.medicaldegree && (
                  <a
                    href={profile.verificationdocument.medicaldegree}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted hover:bg-muted rounded-lg transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">Medical Degree</p>
                    <p className="text-xs text-primary">View Document →</p>
                  </a>
                )}
                {profile.verificationdocument?.medicallicense && (
                  <a
                    href={profile.verificationdocument.medicallicense}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted hover:bg-muted rounded-lg transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">Medical License</p>
                    <p className="text-xs text-primary">View Document →</p>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <p className="font-semibold text-foreground">{profile.phonenumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Age</p>
                      <p className="font-semibold text-foreground">{profile.age} years</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Gender</p>
                      <p className="font-semibold text-foreground">{profile.sex}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold text-foreground">{profile.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-primary mb-1">Department</p>
                      <p className="font-semibold text-foreground capitalize">{profile.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-primary mb-1">Qualification</p>
                      <p className="font-semibold text-foreground">{profile.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-primary mb-1">Experience</p>
                      <p className="font-semibold text-foreground">{profile.experience}+ years</p>
                    </div>
                  </div>

                  {profile.specialization && (
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <Stethoscope className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-purple-700 mb-1">Specialization</p>
                        <p className="font-semibold text-foreground">{profile.specialization}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability Schedule */}
            {profile.shift && profile.shift.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    Availability Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.shift.map((schedule, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-muted rounded-lg border border-border"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-lg">{schedule.day}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{schedule.starttime} - {schedule.endtime}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">
                              {schedule.patientslot} slots
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate("/profile/updateprofile")}
                className="flex-1 gap-2 doctor-accent-gradient hover:opacity-90"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;