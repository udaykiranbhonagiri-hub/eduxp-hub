import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, Clock, Flame, Target, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskRecord {
  id: string;
  title: string;
  description: string | null;
  status: string;
  task_type: string;
  due_date: string | null;
  course_id: string | null;
  courses?: { name: string } | null;
}

export default function StudentTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    supabase
      .from("tasks")
      .select("id, title, description, status, task_type, due_date, course_id, courses(name)")
      .eq("assigned_to", user.id)
      .then(({ data }) => {
        const records = (data as TaskRecord[]) || [];
        setTasks(records);
        setCheckedIds(new Set(records.filter((t) => t.status === "completed").map((t) => t.id)));
        setLoading(false);
      });
  }, [user]);

  const totalXp = tasks.length * 25;
  const earnedXp = checkedIds.size * 25;
  const xpPct = totalXp > 0 ? Math.round((earnedXp / totalXp) * 100) : 0;

  const handleToggle = async (taskId: string) => {
    const newChecked = new Set(checkedIds);
    const wasChecked = newChecked.has(taskId);
    if (wasChecked) {
      newChecked.delete(taskId);
    } else {
      newChecked.add(taskId);
    }
    setCheckedIds(newChecked);

    const newStatus = wasChecked ? "pending" : "completed";
    await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId);

    if (!wasChecked) {
      toast.success("+25 XP earned! 🎯", { description: "Keep crushing your tasks!" });
    }
  };

  const dailyMissions = tasks.filter((t) => t.task_type === "mission" || t.task_type === "daily");
  const regularTasks = tasks.filter((t) => t.task_type !== "mission" && t.task_type !== "daily");

  const formatDue = (d: string | null) => {
    if (!d) return "No due date";
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Tasks & Missions</h2>
        <p className="page-subtitle">Stay on track with your assignments and daily goals</p>
      </div>

      {/* XP Progress Bar */}
      <div className="animate-slide-up stagger-1">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-bold font-display text-foreground">XP Progress</span>
            </div>
            <span className="text-sm font-mono font-semibold text-accent">{earnedXp} / {totalXp} XP</span>
          </div>
          <div className="relative h-4 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${xpPct}%`,
                background: "linear-gradient(90deg, hsl(225, 75%, 55%), hsl(16, 85%, 58%), hsl(42, 95%, 55%))",
                boxShadow: xpPct > 0 ? "0 0 20px hsl(16, 85%, 58%, 0.5), 0 0 40px hsl(225, 75%, 55%, 0.3)" : "none",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {checkedIds.size}/{tasks.length} tasks completed · {xpPct}% progress
          </p>
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto">
          <TabsTrigger value="tasks" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-sm text-sm font-medium">
            <Target className="w-4 h-4 mr-1.5" /> Tasks ({regularTasks.length})
          </TabsTrigger>
          <TabsTrigger value="missions" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-sm text-sm font-medium">
            <Flame className="w-4 h-4 mr-1.5" /> Daily Missions ({dailyMissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3 mt-6">
          {regularTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No tasks assigned yet 🎉</div>
          ) : (
            regularTasks.map((task, i) => {
              const checked = checkedIds.has(task.id);
              const due = formatDue(task.due_date);
              return (
                <Card key={task.id} className={`glass-card animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => handleToggle(task.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-foreground ${checked ? "line-through opacity-60" : ""}`}>{task.title}</p>
                      <p className="text-sm text-muted-foreground">{(task.courses as any)?.name || "General"}</p>
                    </div>
                    <div className="text-right flex items-center gap-3 shrink-0">
                      <Badge variant="secondary" className="rounded-lg text-xs">{task.task_type}</Badge>
                      <span className={`text-xs font-medium ${due === "Today" || due === "Overdue" ? "text-destructive" : due === "Tomorrow" ? "text-accent" : "text-muted-foreground"}`}>
                        {due}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="missions" className="space-y-3 mt-6">
          {dailyMissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No daily missions yet ✨</div>
          ) : (
            dailyMissions.map((task, i) => {
              const checked = checkedIds.has(task.id);
              return (
                <Card key={task.id} className={`glass-card-elevated animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => handleToggle(task.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold text-foreground font-display ${checked ? "line-through opacity-60" : ""}`}>{task.title}</p>
                      {task.description && <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-accent text-accent-foreground">
                      <Zap className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">25 XP</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
