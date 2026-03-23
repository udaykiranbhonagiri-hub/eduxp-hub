import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Users, Building, BookOpen } from "lucide-react";

export default function ManagementDashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: "Total Students", value: "450", icon: GraduationCap, bg: "bg-primary/10", color: "text-primary" },
    { label: "Faculty Members", value: "32", icon: Users, bg: "bg-success/10", color: "text-success" },
    { label: "Departments", value: "5", icon: Building, bg: "bg-accent/10", color: "text-accent" },
    { label: "Active Courses", value: "28", icon: BookOpen, bg: "bg-info/10", color: "text-info" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Management Dashboard ⚙️
        </h2>
        <p className="text-muted-foreground">Overview of your institution</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/management/students" className="block">
          <Card className="glass-card hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-6">
              <GraduationCap className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Manage Students</h3>
              <p className="text-sm text-muted-foreground">Add students by department, year, and section</p>
            </CardContent>
          </Card>
        </a>
        <a href="/management/faculty" className="block">
          <Card className="glass-card hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-success mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Manage Faculty</h3>
              <p className="text-sm text-muted-foreground">Assign faculty to departments and courses</p>
            </CardContent>
          </Card>
        </a>
      </div>
    </div>
  );
}
