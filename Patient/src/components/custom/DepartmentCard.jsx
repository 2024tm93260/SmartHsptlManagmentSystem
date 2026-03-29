import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ArrowRight, 
  Stethoscope,
  Users
} from "lucide-react";

// Map department names to appropriate icons (customize as needed)
const departmentIcons = {
  cardiology: "❤️",
  neurology: "🧠",
  orthopedics: "🦴",
  pediatrics: "👶",
  dermatology: "✨",
  general: "🏥",
  emergency: "🚨",
  surgery: "⚕️",
};

function DepartmentCard({ name, description, onClick }) {
  // Get icon for department or use default
  const icon = departmentIcons[name?.toLowerCase()] || "🏥";

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-card h-full"
    >
      <CardContent className="p-6 relative">
        {/* Background Gradient Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative space-y-4">
          {/* Icon Section */}
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 patient-accent-gradient rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground capitalize group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {description || "Explore our specialized doctors in this department with expert care."}
            </p>
          </div>

          {/* Footer Badge */}
          <div className="pt-3 border-t border-border">
            <Badge variant="secondary" className="text-xs gap-1">
              <Stethoscope className="w-3 h-3" />
              View Specialists
            </Badge>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  );
}

export default DepartmentCard;
