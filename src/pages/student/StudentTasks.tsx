import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, Clock, Flame, Target } from "lucide-react";

export default function StudentTasks() {
  const tasks = [
    { title: "Complete DS Assignment", course: "Data Structures", due: "Tomorrow", status: "pending", type: "assignment" },
    { title: "Read Chapter 5", course: "Database Systems", due: "Today", status: "in_progress", type: "task" },
    { title: "Submit Lab Report", course: "Operating Systems", due: "3 days", status: "pending", type: "assignment" },
    { title: "Practice SQL Queries", course: "Database Systems", due: "Completed", status: "completed", type: "mission" },
  ];

  const missions = [
    { title: "7-Day Streak: Attend all classes", progress: 5, total: 7, xp: 100 },
    { title: "Score 90%+ in next quiz", progress: 0, total: 1, xp: 50 },
    { title: "Complete 5 assignments this week", progress: 3, total: 5, xp: 75 },
  ];

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle className="w-5 h-5 text-success" />;
    if (s === "in_progress") return <Clock className="w-5 h-5 text-accent" />;
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Tasks & Missions</h2>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="missions">Daily Missions</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3 mt-4">
          {tasks.map((task, i) => (
            <Card key={i} className="glass-card hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                {statusIcon(task.status)}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.course}</p>
                </div>
                <div className="text-right">
                  <Badge variant={task.status === "completed" ? "default" : "secondary"}>{task.type}</Badge>
                  <p className={`text-xs mt-1 ${task.due === "Today" ? "text-destructive font-medium" : "text-muted-foreground"}`}>{task.due}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="missions" className="space-y-3 mt-4">
          {missions.map((m, i) => (
            <Card key={i} className="glass-card hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Flame className="w-5 h-5 text-accent" />
                  <p className="font-medium text-foreground flex-1">{m.title}</p>
                  <Badge className="gradient-accent text-accent-foreground border-0">{m.xp} XP</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${(m.progress / m.total) * 100}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground">{m.progress}/{m.total}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
