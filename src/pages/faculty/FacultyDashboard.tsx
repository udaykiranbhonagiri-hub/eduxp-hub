import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Users, BookOpen, ClipboardCheck, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FacultyDashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: "Total Students", value: "120", icon: Users, gradient: "gradient-primary" },
    { label: "Courses", value: "4", icon: BookOpen, gradient: "gradient-accent" },
    { label: "Attendance Marked", value: "95%", icon: ClipboardCheck, gradient: "gradient-success" },
    { label: "Avg Performance", value: "74%", icon: TrendingUp, gradient: "gradient-teal" },
  ];

  const actions = [
    { label: "Mark Attendance", desc: "Record today's class attendance", href: "/faculty/attendance", emoji: "📋" },
    { label: "Update Marks", desc: "Enter exam or quiz marks", href: "/faculty/marks", emoji: "✏️" },
    { label: "Upload Material", desc: "Share resources with students", href: "#", emoji: "📤" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Welcome, {profile?.full_name?.split(" ")[0] || "Faculty"}! 📚</h2>
        <p className="page-subtitle">Manage your classes and track student progress</p>
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

      <div className="animate-slide-up stagger-5">
        <h3 className="text-lg font-semibold font-display text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link key={action.label} to={action.href} className="group">
              <Card className="glass-card-elevated h-full">
                <CardContent className="p-5">
                  <span className="text-2xl mb-3 block">{action.emoji}</span>
                  <h4 className="font-semibold font-display text-foreground mb-1">{action.label}</h4>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                  <span className="flex items-center gap-1 mt-3 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                    Open <ArrowUpRight className="w-3 h-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
