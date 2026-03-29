import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorProfile } from "@/services/patientApi";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Briefcase,
  Building2,
  User,
  Stethoscope,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

function DoctorProfile() {
  const { doctorid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctorProfile, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getDoctorProfile(doctorid));
  }, [dispatch, doctorid]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-muted">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading doctor profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-muted flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!doctorProfile) {
    return (
      <div className="min-h-[60vh] bg-muted flex items-center justify-center p-4">
        <div className="text-center">
          <Stethoscope className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No doctor profile found.</p>
          <Button onClick={() => navigate("/doctors")} className="mt-4">
            Browse Doctors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen patient-page-gradient py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Main Profile Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="patient-accent-gradient text-primary-foreground pb-8 pt-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-card">
                  {doctorProfile.verificationdocument?.profilepicture ? (
                    <img
                      src={doctorProfile.verificationdocument.profilepicture}
                      alt={doctorProfile.doctorname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Badge className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-500">
                  Available
                </Badge>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-3xl mb-2">
                  Dr. {doctorProfile.doctorname}
                </CardTitle>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    <Building2 className="w-3 h-3 mr-1" />
                    {doctorProfile.department}
                  </Badge>
                  {doctorProfile.specialization && (
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                      <Stethoscope className="w-3 h-3 mr-1" />
                      {doctorProfile.specialization}
                    </Badge>
                  )}
                </div>
                <p className="text-primary-foreground/70 text-sm">
                  Providing expert medical care with dedication and compassion
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">
                  {doctorProfile.experience}+
                </p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {doctorProfile.qualification}
                </p>
                <p className="text-sm text-muted-foreground">Qualification</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <GraduationCap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">Expert</p>
                <p className="text-sm text-muted-foreground">Specialist</p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Detailed Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Professional Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Department</p>
                      <p className="font-semibold text-foreground">
                        {doctorProfile.department}
                      </p>
                    </div>
                  </div>

                  {doctorProfile.specialization && (
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <Stethoscope className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                        <p className="font-semibold text-foreground">
                          {doctorProfile.specialization}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Experience</p>
                      <p className="font-semibold text-foreground">
                        {doctorProfile.experience} years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <GraduationCap className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Qualification</p>
                      <p className="font-semibold text-foreground">
                        {doctorProfile.qualification}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <a
                        href={`mailto:${doctorProfile.email}`}
                        className="font-medium text-primary hover:underline">
                        {doctorProfile.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <a
                        href={`tel:${doctorProfile.phonenumber}`}
                        className="font-medium text-primary hover:underline">
                        {doctorProfile.phonenumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-8 border-t">
              <Button
                size="lg"
                onClick={() =>
                  navigate(`/appointments/book-appointment/${doctorProfile._id}`)
                }
                className="w-full md:w-auto gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment with Dr. {doctorProfile.doctorname}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DoctorProfile;