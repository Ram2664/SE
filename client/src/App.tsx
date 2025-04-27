import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import DashboardPage from "@/pages/dashboard/index";
import AdminDashboard from "@/pages/dashboard/admin";
import TeacherDashboard from "@/pages/dashboard/teacher";
import StudentDashboard from "@/pages/dashboard/student";
import StudentsPage from "@/pages/students/index";
import AssignmentsPage from "@/pages/assignments/index";
import ClassesPage from "@/pages/classes/index";
import CalendarPage from "@/pages/calendar/index";
import ReportsPage from "@/pages/reports/index";
import ResourcesPage from "@/pages/resources/index";
import MessagesPage from "@/pages/messages/index";
import SettingsPage from "@/pages/settings/index";
import AITutorPage from "@/pages/ai-tutor/index";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login">
        {() => <Login />}
      </Route>
      
      {/* Protected routes will be handled by the routing guard */}
      <Route path="/*">
        {() => (
          <ProtectedRoutesWrapper />
        )}
      </Route>
      
      {/* Fallback */}
      <Route path="*">
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

// Wrapper for protected routes
function ProtectedRoutesWrapper() {
  return <ProtectedRoutes />;
}

function ProtectedRoutes() {
  return (
    <Switch>
      {/* Dashboard routes - protected by role */}
      <ProtectedRoute path="/" component={() => <DashboardPage />} />
      <ProtectedRoute path="/dashboard/admin" component={() => <AdminDashboard />} allowedRoles={["admin"]} />
      <ProtectedRoute path="/dashboard/teacher" component={() => <TeacherDashboard />} allowedRoles={["teacher"]} />
      <ProtectedRoute path="/dashboard/student" component={() => <StudentDashboard />} allowedRoles={["student"]} />
      
      {/* Main application routes - all protected */}
      <ProtectedRoute path="/students" component={() => <StudentsPage />} allowedRoles={["admin", "teacher"]} />
      <ProtectedRoute path="/assignments" component={() => <AssignmentsPage />} />
      <ProtectedRoute path="/classes" component={() => <ClassesPage />} />
      <ProtectedRoute path="/calendar" component={() => <CalendarPage />} />
      <ProtectedRoute path="/reports" component={() => <ReportsPage />} allowedRoles={["admin", "teacher"]} />
      <ProtectedRoute path="/resources" component={() => <ResourcesPage />} />
      <ProtectedRoute path="/messages" component={() => <MessagesPage />} />
      <ProtectedRoute path="/settings" component={() => <SettingsPage />} />
      <ProtectedRoute path="/ai-tutor" component={() => <AITutorPage />} />
      
      {/* Fallback for protected routes */}
      <Route path="*">
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
