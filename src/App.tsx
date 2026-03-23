import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/components/DashboardLayout";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentTeams from "@/pages/student/StudentTeams";
import StudentTasks from "@/pages/student/StudentTasks";
import StudentCourses from "@/pages/student/StudentCourses";
import StudentMentor from "@/pages/student/StudentMentor";
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";
import FacultyAttendance from "@/pages/faculty/FacultyAttendance";
import FacultyMarks from "@/pages/faculty/FacultyMarks";
import ManagementDashboard from "@/pages/management/ManagementDashboard";
import ManageStudents from "@/pages/management/ManageStudents";
import ManageFaculty from "@/pages/management/ManageFaculty";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // Redirect to role-based dashboard
  const defaultPath = role === "student" ? "/student" : role === "faculty" ? "/faculty" : "/management";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />

      {/* Student Routes */}
      <Route path="/student" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
      <Route path="/student/teams" element={<DashboardLayout><StudentTeams /></DashboardLayout>} />
      <Route path="/student/tasks" element={<DashboardLayout><StudentTasks /></DashboardLayout>} />
      <Route path="/student/courses" element={<DashboardLayout><StudentCourses /></DashboardLayout>} />
      <Route path="/student/mentor" element={<DashboardLayout><StudentMentor /></DashboardLayout>} />

      {/* Faculty Routes */}
      <Route path="/faculty" element={<DashboardLayout><FacultyDashboard /></DashboardLayout>} />
      <Route path="/faculty/attendance" element={<DashboardLayout><FacultyAttendance /></DashboardLayout>} />
      <Route path="/faculty/marks" element={<DashboardLayout><FacultyMarks /></DashboardLayout>} />

      {/* Management Routes */}
      <Route path="/management" element={<DashboardLayout><ManagementDashboard /></DashboardLayout>} />
      <Route path="/management/students" element={<DashboardLayout><ManageStudents /></DashboardLayout>} />
      <Route path="/management/faculty" element={<DashboardLayout><ManageFaculty /></DashboardLayout>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
