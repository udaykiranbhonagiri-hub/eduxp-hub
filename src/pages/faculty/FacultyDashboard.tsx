import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Users, BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";

export default function FacultyDashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: "Total Students", value: "120", icon: Users, bg: "bg-primary/10", color: "text-primary" },
    { label: "Courses", value: "4", icon: BookOpen, bg: "bg-accent/10", color: "text-accent" },
    { label: "Attendance Marked", value: "95%", icon: ClipboardCheck, bg: "bg-success/10", color: "text-success" },
    { label: "Avg Performance", value: "74%", icon: TrendingUp, bg: "bg-info/10", color: "text-info" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome, {profile?.full_name || "Faculty"}! 📚
        </h2>
        <p className="text-muted-foreground">Manage your classes and students</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-display)' }}>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Mark Attendance", desc: "Record today's attendance", href: "/faculty/attendance" },
            { label: "Update Marks", desc: "Enter exam/quiz marks", href: "/faculty/marks" },
            { label: "Upload Material", desc: "Share course resources", href: "#" },
          ].map((action) => (
            <a key={action.label} href={action.href} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors block">
              <p className="font-medium text-foreground">{action.label}</p>
              <p className="text-sm text-muted-foreground">{action.desc}</p>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
