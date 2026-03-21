import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Stethoscope } from "lucide-react";
import UpdateDepartmentModal from "./UpdatedepartmentModal";

const departmentIcons = {
  "General Medicine": "🏥",
  Cardiology: "❤️",
  Neurology: "🧠",
  Orthopedics: "🦴",
  Pediatrics: "👶",
  Dermatology: "✨",
  Gynecology: "🤰",
  Ophthalmology: "👁️",
  ENT: "👂",
  Psychiatry: "🧘",
};

function AdminDepartmentCard({ dept, onClick }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const icon = departmentIcons[dept.deptname] || "🏥";

  return (
    <>
      <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card h-full">
        <CardContent className="p-6 relative">

          {/* Glow Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-muted via-muted to-muted rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative space-y-4" onClick={onClick}>
            {/* Icon */}
            <div className="w-16 h-16 admin-accent-gradient rounded-xl flex items-center justify-center text-3xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>

            {/* Department Name */}
            <h3 className="text-xl font-bold text-foreground capitalize group-hover:text-primary transition-colors duration-300">
              {dept.deptname}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {dept.description || "No description provided."}
            </p>

            <div className="pt-3 border-t border-border">
              <Badge className="text-xs gap-1 admin-accent-gradient text-white">
                <Stethoscope className="w-3 h-3" />
                View Specialists
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between gap-3">
            <Button
              size="sm"
              className="w-full admin-accent-gradient text-primary-foreground hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation();
                setShowUpdateModal(true);
              }}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Update
            </Button>

            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MODALS */}
      <UpdateDepartmentModal
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        dept={dept}
      />
    </>
  );
}

export default AdminDepartmentCard;
