import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { getAllAppointments, getTodayAppointments } from "@/services/appointmentApi";

const StatsOverview = () => {
  const dispatch = useDispatch();
  const { todayappointments, appointments } = useSelector((state) => state.doctorAppointment);

  useEffect(() => {
    dispatch(getTodayAppointments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  let count = 0;
  const completecount = () => {
    todayappointments?.forEach((appointment) => {
      if (appointment.status === "completed") count++;
    });
    return count;
  };

  const totalPatients = () => {
    const uniquePatients = new Set();
    appointments?.forEach((appointment) => {
      if (appointment.status === "Completed") {
        uniquePatients.add(appointment.patientdetails?.patientusername);
      }
    });
    return uniquePatients.size;
  };

  const getYesterdayCount = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return appointments?.filter(a =>
      new Date(a.appointmentdate).toDateString() === yesterday.toDateString()
    ).length || 0;
  };

  const todayCount = todayappointments?.length || 0;
  const yesterdayCount = getYesterdayCount();
  const todayChange = todayCount - yesterdayCount;

  const getUniquePatientsThisWeek = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const unique = new Set();
    appointments?.forEach(a => {
      const date = new Date(a.appointmentdate);
      if (date >= weekStart && date <= now && a.status === "Completed") {
        unique.add(a.patientdetails?.patientusername);
      }
    });
    return unique.size;
  };

  const thisWeekPatients = getUniquePatientsThisWeek();
  const completedToday = completecount();
  const completionRate = todayappointments?.length === 0
    ? 0
    : Math.round((completedToday / todayappointments.length) * 100);

  const statCards = [
    {
      title: "Today's Appointments",
      value: todayCount,
      icon: Calendar,
      color: "from-blue-600 to-blue-700",
      change: todayChange ? (todayChange > 0 ? `+${todayChange} since yesterday` : `${todayChange} since yesterday`) : "No change"
    },
    {
      title: "Total Patients",
      value: totalPatients(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: thisWeekPatients ? `+${thisWeekPatients} this week` : "No new patients this week"
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: CheckCircle2,
      color: "from-sky-500 to-blue-500",
      change: `${completionRate}% completion rate`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <CardContent className="p-0">
              {/* Gradient Header */}
              <div className={`bg-linear-to-r ${stat.color} p-4 flex items-center justify-between`}>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                <p className="text-4xl font-bold text-foreground mb-3">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;