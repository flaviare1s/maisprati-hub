import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ResetPassword } from "./pages/ResetPassword";
import { NewPassword } from "./pages/NewPassword";
import { Forbidden } from "./pages/Forbidden";
import { NotFound } from "./pages/NotFound";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FAQ } from "./pages/FAQ";
import { ChatButton } from "./components/ChatButton";
import { ChatBox } from "./components/ChatBox";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { StudentRegister } from "./pages/StudentRegister";
import { StudentProfile } from "./pages/StudentProfile";
import { TeamSelect } from "./pages/TeamSelect";
import { CommonRoom } from "./pages/CommonRoom";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import { CustomLoader } from "./components/CustomLoader";
import { ScrollToTop } from "./components/ScrollToTop";
import { CodenameSelect } from "./pages/CodenameSelect";

Modal.setAppElement("#root");

function App() {
  const { user } = useAuth();
  const [loadingApp, setLoadingApp] = useState(true)
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLoadingApp(false);
  }, [])

  if (loadingApp) {
    return <CustomLoader />
  }

  return (
    <div className="overflow-x-hidden">
      <ScrollToTop />
      <Header user={user} />
      <div className="fixed bottom-4 right-4 z-50">
        <ChatButton onClick={() => setIsOpen(true)} />
        <ChatBox isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <main className="font-montserrat flex flex-col min-h-[calc(100vh-100px)] overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/warname/" element={<CodenameSelect />} />
          <Route path="/team-select/" element={<TeamSelect />} />
          <Route path="/common-room/" element={<CommonRoom />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/401" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
