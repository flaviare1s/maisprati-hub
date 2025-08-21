import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { StudentForm } from "./pages/StudentForm";
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
import { useState } from "react";

import { Toaster } from "react-hot-toast";
import { StudentRegister } from "./pages/StudentRegister";
import { StudentProfile } from "./pages/StudentProfile";
import { TeamSelect } from "./pages/TeamSelect";
import { CommonRoom } from "./pages/CommonRoom";

Modal.setAppElement("#root");

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Header />
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
          <Route path="/student/form" element={<StudentForm />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/warname/" element={<TeamSelect />} />
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
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
