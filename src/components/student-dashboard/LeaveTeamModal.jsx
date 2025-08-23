export const LeaveTeamModal = ({ open, onClose, reason, setReason, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-light rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4 text-blue-logo">
          Confirmar saída do time
        </h2>
        <p className="text-gray-700 mb-3 text-sm">
          Para confirmar, escreva abaixo o motivo de sair do time:
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-red-400"
          rows="4"
          placeholder="Digite seu motivo aqui..."
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-logo text-light hover:bg-blue-600 transition cursor-pointer"
          >
            Confirmar saída
          </button>
        </div>
      </div>
    </div>
  );
};
