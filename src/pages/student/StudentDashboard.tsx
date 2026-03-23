import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3, BookOpen, Calendar, CheckCircle, Clock, TrendingUp, Award, Target
} from "lucide-react";

export default function StudentDashboard() {
  const { profile } = useAuth();

  // Mock data for first version
  const stats = [
    { label: "Attendance", value: "87%", icon: CheckCircle, color: "text-success", bgColor: "bg-success/10", progress: 87 },
    { label: "Average Marks", value: "78%", icon: BarChart3, color: "text-primary", bgColor: "bg-primary/10", progress: 78 },
    { label: "Tasks Done", value: "12/15", icon: Target, color: "text-accent", bgColor: "bg-accent/10", progress: 80 },
    { label: "CGPA", value: "8.2", icon: Award, color: "text-info", bgColor: "bg-info/10", progress: 82 },
  ];

  const schedule = [
    { time: "09:00", subject: "Data Structures", room: "Room 301" },
    { time: "10:30", subject: "Database Systems", room: "Room 205" },
    { time: "13:00", subject: "Operating Systems", room: "Lab 102" },
    { time: "15:00", subject: "Web Technologies", room: "Room 401" },
  ];

  const recentMarks = [
    { subject: "Data Structures", type: "Mid Sem", marks: 42, total: 50 },
    { subject: "Database Systems", type: "Quiz 2", marks: 8, total: 10 },
    { subject: "Operating Systems", type: "Assignment", marks: 18, total: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {profile?.full_name || "Student"}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">Here's your academic overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card hover:shadow-xl transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <Progress value={stat.progress} className="mt-3 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              <Calendar className="w-5 h-5 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedule.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="text-sm font-mono font-semibold text-primary min-w-[52px]">{item.time}</div>
                <div className="w-px h-8 bg-primary/30" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.room}</p>
                </div>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Marks */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              <BookOpen className="w-5 h-5 text-accent" />
              Recent Marks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMarks.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.marks}<span className="text-muted-foreground text-sm font-normal">/{item.total}</span>
                  </p>
                  <p className={`text-xs font-medium ${(item.marks / item.total) >= 0.7 ? "text-success" : "text-accent"}`}>
                    {Math.round((item.marks / item.total) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Mentor Card */}
      <Card className="glass-card border-accent/30 overflow-hidden">
        <div className="gradient-accent p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-foreground/20 flex items-center justify-center text-2xl">🤖</div>
          <div className="text-accent-foreground">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>AI Mentor Insight</h3>
            <p className="text-sm opacity-90">
              Your attendance in Database Systems dropped 5% this week. I recommend attending tomorrow's class and reviewing Chapter 7 on Normalization. You've got this! 💪
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
