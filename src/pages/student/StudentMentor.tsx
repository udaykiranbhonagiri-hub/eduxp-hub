import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, TrendingDown, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

export default function StudentMentor() {
  const [message, setMessage] = useState("");

  const insights = [
    {
      icon: TrendingDown,
      color: "text-destructive",
      bg: "bg-destructive/10",
      title: "Attendance Alert",
      text: "Your attendance in Database Systems is 72%. You need at least 75% to be eligible for exams. Attend the next 3 classes!",
    },
    {
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
      title: "Great Progress!",
      text: "Your Data Structures scores improved by 15% over the last month. Keep up the consistent practice!",
    },
    {
      icon: AlertTriangle,
      color: "text-accent",
      bg: "bg-accent/10",
      title: "Upcoming Deadline",
      text: "You have 2 assignments due this week. Start with the OS Lab Report — it carries more weight.",
    },
    {
      icon: Sparkles,
      color: "text-primary",
      bg: "bg-primary/10",
      title: "Study Suggestion",
      text: "Based on your quiz results, focus on B+ Trees and Hashing for the upcoming mid-semester exam.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center">
          <Bot className="w-7 h-7 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>AI Mentor</h2>
          <p className="text-muted-foreground">Your personal academic assistant</p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, i) => (
          <Card key={i} className="glass-card hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat-like input */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base" style={{ fontFamily: 'var(--font-display)' }}>Ask your mentor anything</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., How can I improve my CGPA?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button className="gradient-primary text-primary-foreground">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {["Study plan for exams", "Improve attendance", "Career guidance"].map((q) => (
              <button key={q} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
