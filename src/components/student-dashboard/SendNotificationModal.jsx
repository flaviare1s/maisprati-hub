import { useState } from "react";
import { MdClose } from "react-icons/md";
import { sendNotificationToTeacher } from "../../api/notifications";
import toast from "react-hot-toast";
import { CustomLoader } from "../CustomLoader";
import { useAuth } from "../../hooks/useAuth";

export const SendNotificationModal = ({ open, onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!open) return null;

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      await sendNotificationToTeacher(user.name, message);
      toast.success("Notificação enviada ao professor!");
      setMessage("");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar notificação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-dark p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-light rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Enviar mensagem ao professor</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-gray-muted hover:text-gray-700">
            <MdClose size={20} />
          </button>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full text-dark border border-gray-300 rounded-md p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-logo"
          rows={5}
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-2 rounded text-white cursor-pointer ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-logo hover:bg-blue-600"
            }`}
            aria-label="Enviar notificação ao professor"
            title="Enviar notificação ao professor"
        >
          {loading ? <CustomLoader /> : "Enviar"}
        </button>
      </div>
    </div>
  );
};
