import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, Clock, Flame, Target, Zap } from "lucide-react";

export default function StudentTasks() {
  const tasks = [
    { title: "Complete DS Assignment", course: "Data Structures", due: "Tomorrow", status: "pending", type: "assignment" },
    { title: "Read Chapter 5", course: "Database Systems", due: "Today", status: "in_progress", type: "task" },
    { title: "Submit Lab Report", course: "Operating Systems", due: "3 days", status: "pending", type: "assignment" },
    { title: "Practice SQL Queries", course: "Database Systems", due: "Completed", status: "completed", type: "mission" },
  ];

  const missions = [
    { title: "7-Day Streak: Attend all classes", progress: 5, total: 7, xp: 100, emoji: "🔥" },
    { title: "Score 90%+ in next quiz", progress: 0, total: 1, xp: 50, emoji: "🎯" },
    { title: "Complete 5 assignments this week", progress: 3, total: 5, xp: 75, emoji: "📝" },
  ];

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle className="w-5 h-5 text-success" />;
    if (s === "in_progress") return <Clock className="w-5 h-5 text-accent" />;
    return <Circle className="w-5 h-5 text-muted-foreground/40" />;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Tasks & Missions</h2>
        <p className="page-subtitle">Stay on track with your assignments and daily goals</p>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto">
          <TabsTrigger value="tasks" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-sm text-sm font-medium">
            <Target className="w-4 h-4 mr-1.5" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="missions" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-sm text-sm font-medium">
            <Flame className="w-4 h-4 mr-1.5" /> Daily Missions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3 mt-6">
          {tasks.map((task, i) => (
            <Card key={i} className={`glass-card animate-slide-up stagger-${i + 1}`}>
              <CardContent className="p-4 flex items-center gap-4">
                {statusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-foreground ${task.status === "completed" ? "line-through opacity-60" : ""}`}>{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.course}</p>
                </div>
                <div className="text-right flex items-center gap-3 shrink-0">
                  <Badge variant="secondary" className="rounded-lg text-xs">{task.type}</Badge>
                  <span className={`text-xs font-medium ${task.due === "Today" ? "text-destructive" : task.due === "Tomorrow" ? "text-accent" : "text-muted-foreground"}`}>{task.due}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="missions" className="space-y-4 mt-6">
          {missions.map((m, i) => (
            <Card key={i} className={`glass-card-elevated animate-slide-up stagger-${i + 1}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground font-display">{m.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-accent text-accent-foreground">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{m.xp} XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all duration-700" style={{ width: `${(m.progress / m.total) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{m.progress}/{m.total}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
