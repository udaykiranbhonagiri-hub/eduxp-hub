import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Video, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentTeams() {
  const teams = [
    { name: "Project Alpha", members: 4, role: "Team Lead", status: "Active", color: "gradient-primary" },
    { name: "Lab Group B", members: 3, role: "Member", status: "Active", color: "gradient-teal" },
    { name: "Hackathon Squad", members: 5, role: "Member", status: "Upcoming", color: "gradient-accent" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Team Panel</h2>
        <p className="page-subtitle">Collaborate with your teams and classmates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((team, i) => (
          <Card key={i} className={`glass-card-elevated animate-slide-up stagger-${i + 1}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${team.color} flex items-center justify-center shadow-sm`}>
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${team.status === "Active" ? "badge-success" : "badge-warning"}`}>
                  {team.status}
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-foreground mb-1">{team.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                <span>{team.members} members</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-1 text-primary font-medium">
                  {team.role === "Team Lead" && <Crown className="w-3 h-3" />}
                  {team.role}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9">
                  <MessageSquare className="w-4 h-4 mr-1.5" /> Chat
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl h-9">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
