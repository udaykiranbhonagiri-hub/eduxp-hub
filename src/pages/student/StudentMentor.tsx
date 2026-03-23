import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, TrendingDown, TrendingUp, AlertTriangle, Sparkles, ArrowUpRight } from "lucide-react";

export default function StudentMentor() {
  const [message, setMessage] = useState("");

  const insights = [
    {
      icon: TrendingDown,
      gradient: "gradient-accent",
      title: "Attendance Alert",
      text: "Your attendance in Database Systems is 72%. You need 75% to be eligible for exams. Attend the next 3 classes!",
      action: "View Schedule",
    },
    {
      icon: TrendingUp,
      gradient: "gradient-success",
      title: "Great Progress!",
      text: "Your Data Structures scores improved by 15% last month. Keep up the consistent practice!",
      action: "See Marks",
    },
    {
      icon: AlertTriangle,
      gradient: "gradient-primary",
      title: "Upcoming Deadline",
      text: "2 assignments due this week. Start with OS Lab Report — it carries more weight.",
      action: "View Tasks",
    },
    {
      icon: Sparkles,
      gradient: "gradient-teal",
      title: "Study Suggestion",
      text: "Focus on B+ Trees and Hashing for the upcoming mid-semester exam based on your quiz results.",
      action: "Learn More",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 animate-slide-up">
        <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/25">
          <Bot className="w-7 h-7 text-accent-foreground" />
        </div>
        <div>
          <h2 className="page-title">AI Mentor</h2>
          <p className="page-subtitle">Your personal academic assistant & motivator</p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((item, i) => (
          <Card key={i} className={`glass-card-elevated animate-slide-up stagger-${i + 1}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl ${item.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground font-display mb-1.5">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  <button className="flex items-center gap-1 mt-3 text-xs font-medium text-primary hover:gap-2 transition-all">
                    {item.action} <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat input */}
      <Card className="glass-card animate-slide-up">
        <CardContent className="p-6">
          <h4 className="font-semibold font-display text-foreground mb-4">Ask your mentor anything</h4>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., How can I improve my CGPA this semester?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-12 rounded-xl bg-muted/50 border-border/60 text-sm"
            />
            <Button className="h-12 w-12 rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["📊 Study plan for exams", "📈 Improve attendance", "🎯 Career guidance", "💡 Learning tips"].map((q) => (
              <button key={q} className="text-xs px-3.5 py-2 rounded-xl bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium">
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
