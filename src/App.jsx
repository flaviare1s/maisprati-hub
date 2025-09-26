import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { NewPassword } from "./pages/NewPassword";
import { Forbidden } from "./pages/Forbidden";
import { NotFound } from "./pages/NotFound";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useEffect, useState } from "react";
import { StudentRegister } from "./pages/StudentRegister";
import { TeamSelect } from "./pages/TeamSelect";
import { CommonRoom } from "./pages/CommonRoom";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import { CustomLoader } from "./components/CustomLoader";
import { ScrollToTop } from "./components/ScrollToTop";
import { CodenameSelect } from "./pages/CodenameSelect";
import { CreateTeam } from "./pages/CreateTeam";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { TeacherDashboardPage } from "./pages/TeacherDashboardPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProjectBoard } from "./components/project/ProjectBoard";
import { StudentMeetingsTab } from "./components/student-dashboard/StudentMeetingsTab";
import { StudentNotificationsPanel } from "./components/student-dashboard/StudentNotificationsPanel";
import { EditProfile } from "./pages/EditProfile";
import { FAQ } from "./pages/FAQ";

function App() {
  const { user } = useAuth();
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    setLoadingApp(false);
  }, []);

  if (loadingApp) {
    return <CustomLoader />;
  }

  return (
    <div className="overflow-x-hidden">
      <ScrollToTop />
      <Header user={user} />
      <main className="font-montserrat flex flex-col min-h-[calc(100vh-100px)] overflow-x-hidden">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={
                    user.type === "admin"
                      ? "/dashboard/admin"
                      : "/dashboard/student"
                  }
                  replace
                />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={
                user?.type === "admin" ? (
                  <Navigate to="/dashboard/admin" replace />
                ) : (
                  <Navigate to="/dashboard/profile" replace />
                )
              }
            />
            <Route path="profile" element={<StudentDashboardPage />} />
            <Route path="project" element={<ProjectBoard />} />
            <Route path="meetings" element={<StudentMeetingsTab />} />
            <Route
              path="notifications"
              element={<StudentNotificationsPanel />}
            />
            <Route
              path="admin"
              element={
                <PrivateRoute requiredType="admin">
                  <TeacherDashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="student"
              element={<Navigate to="/dashboard/profile" replace />}
            />
          </Route>
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route
            path="/edit-profile/:id"
            element={
              <PrivateRoute requiredType="admin">
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/teams/create/"
            element={
              <PrivateRoute requiredType="admin">
                <CreateTeam />
              </PrivateRoute>
            }
          />
          <Route path="/warname/" element={<CodenameSelect />} />
          <Route path="/team-select/" element={<TeamSelect />} />
          <Route path="/teams/:teamId/board" element={<ProjectBoard />} />
          {user ? (
            <Route path="/common-room/" element={<CommonRoom />} />
          ) : (
            <Route path="/common-room/" element={<Login />} />
          )}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/401" element={<Forbidden />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
