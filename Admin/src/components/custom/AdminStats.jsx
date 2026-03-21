import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Users, Calendar, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import {
  adminGetAllDoctors,
  adminGetAllAppointments,
  adminGetAllDepartments,
} from "@/services/adminApi";

const AdminStats = () => {
  const dispatch = useDispatch();

  const {
    doctors = [],
    allAppointments = [],
    departments = [],
    loading,
  } = useSelector((state) => state.admin);

  // Fetch everything on mount
  useEffect(() => {
    dispatch(adminGetAllDoctors());
    dispatch(adminGetAllAppointments());
    dispatch(adminGetAllDepartments());
  }, [dispatch]);

  // Derived stats
  const totalDoctors = doctors.length;
  const pendingAppointments = useMemo(
    () => allAppointments.filter((a) => a.status === "pending").length,
    [allAppointments]
  );
  const activeDepartments = departments.length;

  const stats = [
    {
      title: "Total Doctors",
      value: totalDoctors,
      icon: Users,
      color: "bg-muted text-primary",
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments,
      icon: Calendar,
      color: "bg-muted text-foreground",
    },
    {
      title: "Active Departments",
      value: activeDepartments,
      icon: ShieldCheck,
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <Card
            key={i}
            className="border-0 shadow-md hover:shadow-lg transition rounded-xl"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
