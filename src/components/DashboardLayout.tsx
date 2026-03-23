import { ReactNode, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, ClipboardList, BookOpen, LogOut, Menu, X,
  GraduationCap, ChevronRight, Bot
} from "lucide-react";

interface Props {
  children: ReactNode;
}

const studentLinks = [
  { to: "/student", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/teams", icon: Users, label: "Team Panel" },
  { to: "/student/tasks", icon: ClipboardList, label: "Tasks & Missions" },
  { to: "/student/courses", icon: BookOpen, label: "Courses" },
];

const facultyLinks = [
  { to: "/faculty", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/faculty/attendance", icon: ClipboardList, label: "Attendance" },
  { to: "/faculty/marks", icon: BookOpen, label: "Marks" },
];

const managementLinks = [
  { to: "/management", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/management/students", icon: GraduationCap, label: "Students" },
  { to: "/management/faculty", icon: Users, label: "Faculty" },
];

export default function DashboardLayout({ children }: Props) {
  const { user, role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = role === "student" ? studentLinks : role === "faculty" ? facultyLinks : managementLinks;
  const roleName = role === "student" ? "Student" : role === "faculty" ? "Faculty" : "Management";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 gradient-primary text-primary-foreground transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>EduTrack</h2>
            <p className="text-xs opacity-80">{roleName} Portal</p>
          </div>
          <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary-foreground/20 shadow-lg"
                    : "hover:bg-primary-foreground/10 opacity-80 hover:opacity-100"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}

          {role === "student" && (
            <Link
              to="/student/mentor"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mt-4 ${
                location.pathname === "/student/mentor"
                  ? "bg-primary-foreground/20 shadow-lg"
                  : "gradient-accent opacity-90 hover:opacity-100"
              }`}
            >
              <Bot className="w-5 h-5" />
              AI Mentor
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-primary-foreground/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
              {profile?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
              <p className="text-xs opacity-70 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            {links.find((l) => l.to === location.pathname)?.label || "Dashboard"}
          </h1>
        </header>
        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
