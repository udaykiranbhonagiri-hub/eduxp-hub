import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Video, Crown, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  role: string;
  user_id: string;
  profiles?: { full_name: string; email: string } | null;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export default function StudentTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Get teams the user belongs to
      const { data: memberOf } = await supabase
        .from("team_members")
        .select("team_id, role")
        .eq("user_id", user.id);

      if (!memberOf || memberOf.length === 0) {
        setLoading(false);
        return;
      }

      const teamIds = memberOf.map((m) => m.team_id);

      // Fetch teams and all their members with profiles
      const { data: teamsData } = await supabase
        .from("teams")
        .select("id, name")
        .in("id", teamIds);

      const { data: allMembers } = await supabase
        .from("team_members")
        .select("team_id, role, user_id")
        .in("team_id", teamIds);

      // Fetch profiles for all member user_ids
      const userIds = [...new Set((allMembers || []).map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const enrichedTeams: Team[] = (teamsData || []).map((t) => ({
        id: t.id,
        name: t.name,
        members: (allMembers || [])
          .filter((m) => m.team_id === t.id)
          .map((m) => ({
            ...m,
            profiles: profileMap.get(m.user_id) || null,
          })),
      }));

      setTeams(enrichedTeams);
      setLoading(false);
    };
    load();
  }, [user]);

  const gradients = ["gradient-primary", "gradient-teal", "gradient-accent", "gradient-success"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Team Panel</h2>
        <p className="page-subtitle">Collaborate with your project group members</p>
      </div>

      {teams.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium">You haven't been assigned to any teams yet.</p>
            <p className="text-sm mt-1">Teams are created by management. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        teams.map((team, ti) => (
          <div key={team.id} className={`animate-slide-up stagger-${Math.min(ti + 1, 6)}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl ${gradients[ti % gradients.length]} flex items-center justify-center shadow-sm`}>
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-foreground">{team.name}</h3>
                <p className="text-xs text-muted-foreground">{team.members.length} members</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.members.map((member, mi) => (
                <Card key={member.user_id} className="glass-card-elevated">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl gradient-teal flex items-center justify-center text-sm font-bold text-primary-foreground">
                        {member.profiles?.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {member.profiles?.full_name || "Unknown"}
                          {member.user_id === user?.id && <span className="text-xs text-primary ml-1">(You)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{member.profiles?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        member.role === "leader" ? "badge-accent" : "badge-info"
                      }`}>
                        {member.role === "leader" && <Crown className="w-3 h-3 inline mr-1" />}
                        {member.role}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
