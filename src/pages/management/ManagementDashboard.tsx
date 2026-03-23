import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Users, Building, BookOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ManagementDashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: "Total Students", value: "450", icon: GraduationCap, gradient: "gradient-primary" },
    { label: "Faculty Members", value: "32", icon: Users, gradient: "gradient-success" },
    { label: "Departments", value: "5", icon: Building, gradient: "gradient-accent" },
    { label: "Active Courses", value: "28", icon: BookOpen, gradient: "gradient-teal" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Management Dashboard ⚙️</h2>
        <p className="page-subtitle">Institution overview and administration</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`stat-card animate-slide-up stagger-${i + 1}`}>
            <div className={`w-11 h-11 rounded-2xl ${s.gradient} flex items-center justify-center shadow-sm mb-4`}>
              <s.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground font-display">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up stagger-5">
        <Link to="/management/students" className="group">
          <Card className="glass-card-elevated h-full">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground mb-2">Manage Students</h3>
              <p className="text-sm text-muted-foreground mb-4">Add students by department, year, and section. Assign them to classes and track enrollment.</p>
              <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Open <ArrowUpRight className="w-4 h-4" />
              </span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/management/faculty" className="group">
          <Card className="glass-card-elevated h-full">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl gradient-success flex items-center justify-center shadow-lg shadow-success/20 mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-7 h-7 text-success-foreground" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground mb-2">Manage Faculty</h3>
              <p className="text-sm text-muted-foreground mb-4">Assign faculty to departments and courses. Manage teaching assignments and schedules.</p>
              <span className="flex items-center gap-1 text-sm font-medium text-success group-hover:gap-2 transition-all">
                Open <ArrowUpRight className="w-4 h-4" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
