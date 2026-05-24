import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllLabTests } from "@/services/labtestApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  FlaskConical,
  AlertCircle,
  Calendar,
  User,
  CheckCircle2,
  Clock,
} from "lucide-react";

const AllLabTests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { labtests, loading, error } = useSelector((state) => state.labtest);

  useEffect(() => {
    dispatch(getAllLabTests());
  }, [dispatch]);

  const getStatusBadge = (status = "ordered") => {
    const statusConfig = {
      ordered: { icon: Clock, color: "text-yellow-700 bg-yellow-100" },
      processing: { icon: Clock, color: "text-blue-700 bg-blue-100" },
      completed: { icon: CheckCircle2, color: "text-green-700 bg-green-100" },
    };

    const config = statusConfig[status] || statusConfig.ordered;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-muted">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading lab reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-muted flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || "Failed to load lab reports"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen doctor-page-gradient py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <FlaskConical className="w-3 h-3 mr-1" />
            Lab Reports
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">All Lab Reports</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track ordered, processing, and completed patient lab reports
          </p>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Total Reports: <span className="font-semibold text-primary">{labtests?.length || 0}</span>
            </p>
          </div>
        </div>

        {labtests?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labtests.map((labTest) => (
              <Card
                key={labTest._id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/labtests/${labTest._id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      Lab Report
                    </CardTitle>
                    {getStatusBadge(labTest.overall_status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {labTest.patient_id?.patientname || "Patient"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FlaskConical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {labTest.tests?.length || 0} Test(s)
                    </span>
                  </div>

                  {labTest.report_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(labTest.report_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/labtests/${labTest._id}`);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl shadow-sm">
            <FlaskConical className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Lab Reports Yet</h3>
            <p className="text-muted-foreground mb-6">
              Lab reports will appear here once created from prescriptions.
            </p>
            <Button onClick={() => navigate("/prescriptions")}>View Prescriptions</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLabTests;
