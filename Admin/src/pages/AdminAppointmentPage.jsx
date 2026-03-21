import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  adminGetAllAppointments,
  adminGetTodayAppointments,
} from "@/services/adminApi";

const AdminAppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isTodayPage = location.pathname === "/todayappointments";

  const {
    allAppointments,
    todayAppointments,
    loading,
    error,
  } = useSelector((state) => state.admin);

  const data = isTodayPage ? todayAppointments : allAppointments;

  useEffect(() => {
    if (isTodayPage) dispatch(adminGetTodayAppointments());
    else dispatch(adminGetAllAppointments());
  }, [dispatch, isTodayPage]);

  const title = isTodayPage
    ? "Today's Appointments"
    : "All Appointments";

  const description = isTodayPage
    ? `You have ${data?.length || 0} appointments for today`
    : `Viewing all appointments across all dates`;

  const getName = (a) =>
    a?.patientdetails?.patientname ||
    a?.patientname ||
    "Unknown Patient";

  const getInitials = (name) =>
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "NA";

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen admin-page-gradient">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
        <p className="text-muted-foreground font-medium">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Failed to load appointments. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-page-gradient py-8">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2 text-primary hover:text-primary/80"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Appointments Card */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Calendar className="w-7 h-7 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {data?.map((appointment, index) => {
              const name = getName(appointment);

              return (
                <div key={appointment._id}>
                  <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition">
                    
                    {/* Avatar + Patient info */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12 border-2 border-border">
                        <AvatarFallback className="bg-muted text-primary font-semibold">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-foreground">{name}</h4>

                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs capitalize"
                          >
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.appointmenttime}
                          </span>
                          <span>•</span>
                          <span>{appointment.appointmenttype || "Appointment"}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-primary hover:text-primary/80"
                      onClick={() => navigate(`/admin/appointments/${appointment._id}`)}
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </Button>

                  </div>

                  {index < data.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              );
            })}

            {data?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No appointments available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
