import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllPrescriptions } from "@/services/prescriptionApi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Loader2,
  FileText,
  AlertCircle,
  Pill,
  Calendar,
  User,
  ArrowLeft
} from "lucide-react";

const AllPrescriptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { prescriptions, loading, error } = useSelector(
    (state) => state.prescription
  );

  useEffect(() => {
    dispatch(getAllPrescriptions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] doctor-page-gradient">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 bg-linear-to-br from-red-50 to-red-100">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load prescriptions</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen doctor-page-gradient py-12">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute left-0 top-0 flex items-center gap-2 text-primary hover:text-foreground hover:bg-muted/40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Badge className="mb-4 bg-white/20 text-white border-0">
            <FileText className="w-3 h-3 mr-1" />
            My Prescriptions
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Your Prescriptions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access all prescriptions created during your medical visits
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Total:{" "}
            <span className="font-semibold text-primary">
              {prescriptions?.length || 0}
            </span>
          </p>
        </div>

        {/* Prescriptions Grid */}
        {prescriptions?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <Card
                key={prescription._id}
                className="bg-white rounded-2xl border border-border shadow-md hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/prescriptions/${prescription._id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                      <Pill className="w-5 h-5 text-primary" />
                      Prescription
                    </CardTitle>
                    <Badge className="bg-muted text-primary border-border text-xs">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 text-primary" />
                    Dr. {prescription.doctordetails?.doctorname}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 text-primary" />
                    Diagnosis:{" "}
                    <span className="font-medium text-foreground">
                      {prescription.diagonosis}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Pill className="w-4 h-4 text-primary" />
                    {prescription.medicines?.length || 0} Medicine(s)
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-border text-primary hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/prescriptions/${prescription._id}`);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-border">
            <FileText className="w-16 h-16 text-primary/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">
              No Prescriptions Found
            </h3>
            <p className="text-muted-foreground mt-2">
              Prescriptions will appear here once created.
            </p>

            <Button
              className="mt-6 bg-primary hover:bg-secondary"
              onClick={() => navigate("/appointments")}
            >
              View Appointments
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllPrescriptions;
