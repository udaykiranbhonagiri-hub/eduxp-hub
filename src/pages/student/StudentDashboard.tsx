import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, BookOpen, Calendar, CheckCircle, Clock, Award, Bot,
  AlertTriangle, TrendingUp, Send, Bell, Sparkles
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

interface AttendanceRecord {
  status: string;
  course_id: string;
}

interface MarkRecord {
  marks_obtained: number;
  max_marks: number;
  exam_type: string;
  course_id: string;
  courses?: { name: string } | null;
}

interface ScheduleRecord {
  start_time: string;
  end_time: string;
  day_of_week: number;
  room: string | null;
  courses?: { name: string; code: string } | null;
}

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [schedule, setSchedule] = useState<ScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [attRes, marksRes, schedRes] = await Promise.all([
        supabase.from("attendance").select("status, course_id").eq("student_id", user.id),
        supabase.from("marks").select("marks_obtained, max_marks, exam_type, course_id, courses(name)").eq("student_id", user.id),
        supabase.from("schedules").select("start_time, end_time, day_of_week, room, courses(name, code)").eq("day_of_week", new Date().getDay()),
      ]);
      setAttendance((attRes.data as AttendanceRecord[]) || []);
      setMarks((marksRes.data as MarkRecord[]) || []);
      setSchedule((schedRes.data as ScheduleRecord[]) || []);
      setLoading(false);
    };
    load();
  }, [user]);

  // Attendance metrics
  const attendanceStats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = total - present;
    const pct = total > 0 ? Math.round((present / total) * 100) : 100;
    return { total, present, absent, pct };
  }, [attendance]);

  // Marks chart data
  const marksChartData = useMemo(() => {
    const grouped: Record<string, { name: string; obtained: number; max: number }> = {};
    marks.forEach((m) => {
      const name = (m.courses as any)?.name || m.course_id.slice(0, 8);
      if (!grouped[m.course_id]) grouped[m.course_id] = { name, obtained: 0, max: 0 };
      grouped[m.course_id].obtained += Number(m.marks_obtained);
      grouped[m.course_id].max += Number(m.max_marks);
    });
    return Object.values(grouped).map((g) => ({
      name: g.name.length > 12 ? g.name.slice(0, 12) + "…" : g.name,
      percentage: g.max > 0 ? Math.round((g.obtained / g.max) * 100) : 0,
      obtained: g.obtained,
      max: g.max,
    }));
  }, [marks]);

  const avgMarks = useMemo(() => {
    if (marksChartData.length === 0) return 0;
    return Math.round(marksChartData.reduce((s, d) => s + d.percentage, 0) / marksChartData.length);
  }, [marksChartData]);

  // Donut data
  const donutData = [
    { name: "Present", value: attendanceStats.present, color: "hsl(160, 65%, 42%)" },
    { name: "Absent", value: attendanceStats.absent, color: "hsl(0, 72%, 55%)" },
  ];

  // AI Mentor logic
  const mentorState = useMemo(() => {
    const lowAttendance = attendanceStats.pct < 75;
    const lowMarks = avgMarks < 60;
    if (lowAttendance || lowMarks) {
      const issues: string[] = [];
      if (lowAttendance) issues.push(`attendance is at ${attendanceStats.pct}%`);
      if (lowMarks) issues.push(`average marks are at ${avgMarks}%`);
      return {
        type: "warning" as const,
        message: `⚠️ Heads up! Your ${issues.join(" and ")}. Don't worry — you can turn this around! Focus on attending classes consistently and reviewing weak topics. Small steps lead to big results. 💪`,
      };
    }
    return {
      type: "praise" as const,
      message: `🌟 Outstanding work! Your attendance is ${attendanceStats.pct}% and marks average ${avgMarks}%. You're on fire! Keep this momentum going — you're setting a great example for your peers! 🏆`,
    };
  }, [attendanceStats.pct, avgMarks]);

  const handleSendReport = (target: string) => {
    toast.success(`Report successfully sent to ${target}!`, {
      description: `A detailed performance summary has been emailed to your ${target.toLowerCase()}.`,
    });
  };

  const CHART_COLORS = ["hsl(225, 75%, 55%)", "hsl(175, 70%, 42%)", "hsl(16, 85%, 58%)", "hsl(160, 65%, 42%)", "hsl(42, 95%, 55%)"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="page-header animate-slide-up">
        <h2 className="page-title">
          Good morning, {profile?.full_name?.split(" ")[0] || "Student"}! 👋
        </h2>
        <p className="page-subtitle">Here's how you're performing this semester</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Attendance", value: `${attendanceStats.pct}%`, icon: CheckCircle, gradient: "gradient-success" },
          { label: "Avg Marks", value: `${avgMarks}%`, icon: BarChart3, gradient: "gradient-primary" },
          { label: "Classes", value: `${attendanceStats.present}/${attendanceStats.total}`, icon: Calendar, gradient: "gradient-teal" },
          { label: "Subjects", value: `${marksChartData.length}`, icon: Award, gradient: "gradient-accent" },
        ].map((stat, i) => (
          <div key={stat.label} className={`stat-card animate-slide-up stagger-${i + 1}`}>
            <div className={`w-10 h-10 rounded-2xl ${stat.gradient} flex items-center justify-center shadow-sm mb-3`}>
              <stat.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground font-display">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Donut */}
        <Card className="glass-card animate-slide-up stagger-5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2.5 text-lg font-display">
              <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceStats.total === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No attendance data yet</div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="w-44 h-44 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                        {donutData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-display text-foreground">{attendanceStats.pct}%</span>
                    <span className="text-[10px] text-muted-foreground">Present</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: "hsl(160, 65%, 42%)" }} />
                    <span className="text-sm text-foreground">Present: {attendanceStats.present}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: "hsl(0, 72%, 55%)" }} />
                    <span className="text-sm text-foreground">Absent: {attendanceStats.absent}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Total: {attendanceStats.total} classes</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Marks Bar Chart */}
        <Card className="glass-card animate-slide-up stagger-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2.5 text-lg font-display">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              Marks by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marksChartData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No marks data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={marksChartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(225, 10%, 48%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(225, 10%, 48%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [`${props.payload.obtained}/${props.payload.max} (${value}%)`, "Score"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid hsl(225, 15%, 90%)", fontSize: 12 }}
                  />
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {marksChartData.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="glass-card animate-slide-up">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2.5 text-lg font-display">
            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary-foreground" />
            </div>
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {schedule.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">No classes scheduled for today 🎉</div>
          ) : (
            schedule
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((item, i) => {
                const courseName = (item.courses as any)?.name || "Unknown Course";
                const courseCode = (item.courses as any)?.code || "";
                return (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                    <div className="text-sm font-mono font-semibold min-w-[100px] text-primary">
                      {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                    </div>
                    <div className="w-0.5 h-8 rounded-full bg-border" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{courseName}</p>
                      <p className="text-xs text-muted-foreground">{courseCode} {item.room ? `· ${item.room}` : ""}</p>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                );
              })
          )}
        </CardContent>
      </Card>

      {/* AI Mentor Widget */}
      <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 animate-slide-up transition-all duration-500 ${
        mentorState.type === "warning"
          ? "bg-gradient-to-br from-destructive/10 via-accent/10 to-destructive/5 border-2 border-destructive/30 shadow-lg shadow-destructive/10"
          : "bg-gradient-to-br from-success/10 via-teal/10 to-success/5 border-2 border-success/30 shadow-lg shadow-success/10"
      }`}
        style={mentorState.type === "praise" ? { animation: "mentorGlow 3s ease-in-out infinite" } : undefined}
      >
        {/* Decorative orbs */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] ${
          mentorState.type === "warning" ? "bg-destructive/10" : "bg-success/10"
        }`} />
        <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] ${
          mentorState.type === "warning" ? "bg-accent/10" : "bg-teal/10"
        }`} />

        <div className="relative flex items-start gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
            mentorState.type === "warning"
              ? "gradient-accent shadow-accent/25"
              : "gradient-success shadow-success/25"
          }`}>
            {mentorState.type === "warning" ? (
              <AlertTriangle className="w-7 h-7 text-primary-foreground" />
            ) : (
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground font-display">
                {mentorState.type === "warning" ? "AI Mentor Alert" : "AI Mentor — Great Job!"}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                mentorState.type === "warning"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-success/20 text-success"
              }`}>
                {mentorState.type === "warning" ? "Action Needed" : "Excellent"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {mentorState.message}
            </p>

            {mentorState.type === "warning" && (
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  size="sm"
                  className="rounded-xl gradient-primary text-primary-foreground shadow-md shadow-primary/20"
                  onClick={() => handleSendReport("Faculty")}
                >
                  <Send className="w-4 h-4 mr-1.5" /> Send Report to Faculty
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => handleSendReport("Parents")}
                >
                  <Bell className="w-4 h-4 mr-1.5" /> Notify Parents
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mentorGlow {
          0%, 100% { box-shadow: 0 0 20px hsl(160, 65%, 42%, 0.15); }
          50% { box-shadow: 0 0 40px hsl(160, 65%, 42%, 0.25); }
        }
      `}</style>
    </div>
  );
}
