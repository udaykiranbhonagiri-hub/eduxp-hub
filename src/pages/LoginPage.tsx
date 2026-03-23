import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, Settings, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

type RoleTab = "student" | "faculty" | "management";

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<RoleTab>("student");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const roleConfig = {
    student: { icon: GraduationCap, label: "Student", color: "from-primary to-primary/80", desc: "Access your dashboard, courses & AI mentor" },
    faculty: { icon: Users, label: "Faculty", color: "from-success to-success/80", desc: "Manage attendance, marks & course content" },
    management: { icon: Settings, label: "Management", color: "from-accent to-accent/80", desc: "Administer students, faculty & departments" },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName, activeRole);
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const Cfg = roleConfig[activeRole];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full gradient-primary opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full gradient-accent opacity-10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary" style={{ fontFamily: 'var(--font-display)' }}>EduTrack Pro</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-1">Sign in to your portal</p>
        </div>

        <Tabs value={activeRole} onValueChange={(v) => setActiveRole(v as RoleTab)}>
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
            {(["student", "faculty", "management"] as RoleTab[]).map((r) => {
              const Icon = roleConfig[r].icon;
              return (
                <TabsTrigger key={r} value={r} className="flex items-center gap-1.5 text-xs font-medium">
                  <Icon className="w-4 h-4" />
                  {roleConfig[r].label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <Card className="glass-card">
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${Cfg.color} flex items-center justify-center mb-2`}>
                <Cfg.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle style={{ fontFamily: 'var(--font-display)' }}>
                {isSignUp ? "Create Account" : "Sign In"} as {Cfg.label}
              </CardTitle>
              <CardDescription>{Cfg.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                  {loading ? "Please wait..." : isSignUp ? (
                    <><UserPlus className="w-4 h-4 mr-2" />Create Account</>
                  ) : (
                    <><LogIn className="w-4 h-4 mr-2" />Sign In</>
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                </button>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
