import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { UserRegister } from "./pages/UserRegister";
import { ClinicRegister } from "./pages/ClinicRegister";
import { UserDashboard } from "./pages/UserDashboard";
import { ClinicDashboard } from "./pages/ClinicDashboard";
import { UserProfile } from "./pages/UserProfile";
import { DonationHistory } from "./pages/DonationHistory";
import { Appointments } from "./pages/Appointments";
import { AppointmentForm } from "./pages/AppointmentForm";
import { AppointmentManager } from "./pages/AppointmentManager";
import { CampaignList } from "./pages/CampaignList";
import { CampaignForm } from "./pages/CampaignForm";
import { LocationFinder } from "./pages/LocationFinder";
import { AIAssistant } from "./pages/AIAssistant";
import { ResetPassword } from "./pages/ResetPassword";
import { Forbidden } from "./pages/Forbidden";
import { NotFound } from "./pages/NotFound";
import { SelectAccountType } from "./pages/SelectAccountType";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FAQ } from "./pages/FAQ";
import { ChatButton } from "./components/ChatButton";
import { ChatBox } from "./components/ChatBox";
import Modal from "react-modal";
import { useState } from "react";

Modal.setAppElement("#root")

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Header />
      <div className="fixed bottom-4 right-4 z-50">
        <ChatButton onClick={() => setIsOpen(true)} />
        <ChatBox isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <main className="font-roboto flex flex-col min-h-[calc(100vh-100px)] overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SelectAccountType />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/clinic" element={<ClinicRegister />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/clinic" element={<ClinicDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/donations" element={<DonationHistory />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointment/form" element={<AppointmentForm />} />
          <Route path="/appointment/manage" element={<AppointmentManager />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaign/form" element={<CampaignForm />} />
          <Route path="/location" element={<LocationFinder />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
