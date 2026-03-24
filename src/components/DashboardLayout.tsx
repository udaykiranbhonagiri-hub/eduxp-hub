import { ReactNode, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, ClipboardList, BookOpen, LogOut, Menu, X,
  GraduationCap, Bot, ChevronLeft, Bell, Search, UserCog
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
  { to: "/faculty/students", icon: UserCog, label: "Student Manager" },
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
  const [collapsed, setCollapsed] = useState(false);

  const links = role === "student" ? studentLinks : role === "faculty" ? facultyLinks : managementLinks;
  const roleBadge = role === "student" ? "STU" : role === "faculty" ? "FAC" : "MGT";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${sidebarWidth} bg-sidebar flex flex-col transform transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Header */}
        <div className={`h-16 flex items-center border-b border-sidebar-border ${collapsed ? "justify-center px-2" : "px-5"}`}>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="ml-3 text-lg font-bold font-display text-sidebar-accent-foreground tracking-tight">EduTrack</span>
          )}
          <button className="lg:hidden ml-auto text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
          <button className="hidden lg:flex ml-auto text-sidebar-muted hover:text-sidebar-foreground transition-colors" onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-5 py-3">
            <div className="px-3 py-1.5 rounded-lg bg-sidebar-accent text-xs font-medium text-sidebar-primary font-display tracking-wider">
              {role === "student" ? "🎓 Student Portal" : role === "faculty" ? "📚 Faculty Portal" : "⚙️ Management Portal"}
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className={`flex-1 ${collapsed ? "px-2" : "px-3"} space-y-1 py-2`}>
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? link.label : undefined}
                className={`flex items-center gap-3 ${collapsed ? "justify-center px-2" : "px-3"} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                <link.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}

          {role === "student" && (
            <>
              <div className={`my-3 h-px bg-sidebar-border ${collapsed ? "mx-1" : "mx-2"}`} />
              <Link
                to="/student/mentor"
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? "AI Mentor" : undefined}
                className={`flex items-center gap-3 ${collapsed ? "justify-center px-2" : "px-3"} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/student/mentor"
                    ? "gradient-accent text-accent-foreground shadow-md shadow-accent/20"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Bot className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span>AI Mentor</span>}
                {!collapsed && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-accent/20 text-accent font-bold">NEW</span>
                )}
              </Link>
            </>
          )}
        </nav>

        {/* User section */}
        <div className={`border-t border-sidebar-border ${collapsed ? "p-2" : "p-4"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center text-sm font-bold text-teal-foreground shrink-0">
              {profile?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{profile?.full_name || "User"}</p>
                <p className="text-xs text-sidebar-muted truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`${collapsed ? "w-9 h-9 p-0 justify-center" : "w-full justify-start"} mt-2 text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-xl`}
            onClick={handleSignOut}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2 text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-30 flex items-center px-4 sm:px-6 gap-3">
          <button className="lg:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground font-display">
            {links.find((l) => l.to === location.pathname)?.label || (location.pathname.includes("mentor") ? "AI Mentor" : "Dashboard")}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
