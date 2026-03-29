import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAppointments } from "@/services/appointmentApi";
import AppointmentCard from "@/components/custom/AppointmentCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Loader2,
  Calendar,
  AlertCircle,
  CalendarClock
} from "lucide-react";

const AllAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(
    (state) => state.appointment
  );
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-muted">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-muted flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load appointments</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen patient-page-gradient py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <CalendarClock className="w-3 h-3 mr-1" />
            My Appointments
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Appointments
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View and manage all your scheduled medical appointments
          </p>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Total Appointments: <span className="font-semibold text-primary">{appointments?.length || 0}</span>
            </p>
          </div>
        </div>

        {/* Appointments Grid */}
        {appointments?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl shadow-sm">
            <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Appointments Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              You haven't scheduled any appointments. Book one now to get started!
            </p>
            <Button onClick={() => navigate("/doctors")}>
              Browse Doctors
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;