import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users, Settings, LogIn, UserPlus, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import loginHero from "@/assets/login-hero.jpg";

type RoleTab = "student" | "faculty" | "management";

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<RoleTab>("student");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const roleConfig = {
    student: { icon: GraduationCap, label: "Student", emoji: "🎓", desc: "Access dashboard, courses & your AI mentor" },
    faculty: { icon: Users, label: "Faculty", emoji: "📚", desc: "Manage attendance, marks & course content" },
    management: { icon: Settings, label: "Management", emoji: "⚙️", desc: "Administer students, faculty & departments" },
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
    <div className="min-h-screen flex bg-background">
      {/* Left Panel — Hero */}
      <div className="hidden lg:flex lg:w-[45%] relative gradient-dark overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-teal/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-accent/15 blur-[80px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground font-display tracking-tight">EduTrack Pro</span>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex items-center justify-center py-8">
            <img src={loginHero} alt="Digital campus illustration" width={800} height={1024} className="w-full max-w-md rounded-3xl shadow-2xl" />
          </div>

          {/* Bottom text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium font-display">AI-Powered Learning</span>
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground font-display leading-tight">
              Your personal academic<br />companion, reimagined.
            </h2>
            <p className="text-sm text-primary-foreground/50 max-w-sm">
              Track performance, collaborate with peers, and get personalized mentoring — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="gradient-mesh absolute inset-0 pointer-events-none" />

        <div className="w-full max-w-[420px] relative animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display text-foreground">EduTrack Pro</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display text-foreground">
              {isSignUp ? "Create account" : "Welcome back"} {Cfg.emoji}
            </h1>
            <p className="text-muted-foreground mt-2">{Cfg.desc}</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 p-1.5 bg-muted rounded-2xl mb-8">
            {(["student", "faculty", "management"] as RoleTab[]).map((r) => {
              const Icon = roleConfig[r].icon;
              const active = activeRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{roleConfig[r].label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2 animate-slide-up">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-12 rounded-xl bg-muted/50 border-border/60 focus:bg-card text-sm"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                required
                className="h-12 rounded-xl bg-muted/50 border-border/60 focus:bg-card text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-12 rounded-xl bg-muted/50 border-border/60 focus:bg-card text-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : isSignUp ? (
                <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span className="text-primary font-medium">{isSignUp ? "Sign in" : "Sign up"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
