import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3, BookOpen, Calendar, CheckCircle, Clock, TrendingUp, Award, Target, ArrowUpRight, Bot
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: "Attendance", value: "87%", icon: CheckCircle, gradient: "gradient-success", progress: 87, trend: "+2%" },
    { label: "Average Marks", value: "78%", icon: BarChart3, gradient: "gradient-primary", progress: 78, trend: "+5%" },
    { label: "Tasks Done", value: "12/15", icon: Target, gradient: "gradient-accent", progress: 80, trend: "3 left" },
    { label: "CGPA", value: "8.2", icon: Award, gradient: "gradient-teal", progress: 82, trend: "+0.3" },
  ];

  const schedule = [
    { time: "09:00", subject: "Data Structures", room: "Room 301", active: true },
    { time: "10:30", subject: "Database Systems", room: "Room 205", active: false },
    { time: "13:00", subject: "Operating Systems", room: "Lab 102", active: false },
    { time: "15:00", subject: "Web Technologies", room: "Room 401", active: false },
  ];

  const recentMarks = [
    { subject: "Data Structures", type: "Mid Sem", marks: 42, total: 50 },
    { subject: "Database Systems", type: "Quiz 2", marks: 8, total: 10 },
    { subject: "Operating Systems", type: "Assignment", marks: 18, total: 20 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="page-header animate-slide-up">
        <h2 className="page-title">
          Good morning, {profile?.full_name?.split(" ")[0] || "Student"}! 👋
        </h2>
        <p className="page-subtitle">Here's how you're performing this semester</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`stat-card animate-slide-up stagger-${i + 1}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl ${stat.gradient} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground font-display">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${stat.gradient} transition-all duration-1000`} style={{ width: `${stat.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="glass-card animate-slide-up stagger-5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-display">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary-foreground" />
              </div>
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {schedule.map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-3.5 rounded-xl transition-colors ${item.active ? "bg-primary/5 border border-primary/15" : "bg-muted/40 hover:bg-muted/70"}`}>
                <div className={`text-sm font-mono font-semibold min-w-[52px] ${item.active ? "text-primary" : "text-muted-foreground"}`}>
                  {item.time}
                </div>
                <div className={`w-0.5 h-8 rounded-full ${item.active ? "bg-primary" : "bg-border"}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.active ? "text-foreground" : "text-foreground/80"}`}>{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.room}</p>
                </div>
                {item.active && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-primary/10 text-primary uppercase tracking-wider">Now</span>
                )}
                {!item.active && <Clock className="w-4 h-4 text-muted-foreground/40" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Marks */}
        <Card className="glass-card animate-slide-up stagger-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-display">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-accent-foreground" />
              </div>
              Recent Marks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMarks.map((item, i) => {
              const pct = Math.round((item.marks / item.total) * 100);
              return (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 70 ? "gradient-success" : "gradient-accent"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground font-display">
                        {item.marks}<span className="text-muted-foreground text-xs font-normal">/{item.total}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* AI Mentor Card */}
      <Link to="/student/mentor" className="block animate-slide-up">
        <div className="relative overflow-hidden rounded-2xl gradient-dark p-6 sm:p-8 group hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/10 blur-[80px] group-hover:bg-accent/15 transition-colors" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary/10 blur-[60px]" />
          <div className="relative flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/25 shrink-0">
              <Bot className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-primary-foreground font-display">AI Mentor Insight</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/20 text-accent uppercase tracking-wider">Live</span>
              </div>
              <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-lg">
                Your attendance in Database Systems dropped 5% this week. I recommend attending tomorrow's class and reviewing Chapter 7 on Normalization. You've got this! 💪
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent group-hover:gap-2 transition-all">
                Talk to your mentor <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
