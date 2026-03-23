import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentTeams() {
  const teams = [
    { name: "Project Alpha", members: 4, role: "Team Lead", status: "Active" },
    { name: "Lab Group B", members: 3, role: "Member", status: "Active" },
    { name: "Hackathon Squad", members: 5, role: "Member", status: "Upcoming" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Team Panel</h2>
          <p className="text-muted-foreground">Collaborate with your teams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team, i) => (
          <Card key={i} className="glass-card hover:shadow-xl transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${team.status === "Active" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
                  {team.status}
                </span>
              </div>
              <CardTitle className="text-lg mt-2" style={{ fontFamily: 'var(--font-display)' }}>{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{team.members} members</span>
                <span className="text-primary font-medium">{team.role}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-1" /> Chat
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
