export const ConfirmationModal = ({ open, message, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed px-2 inset-0 z-50 flex items-center justify-center bg-[#000000ac]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Confirmação
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-2 text-sm font-medium text-blue-logo bg-white border rounded-lg transition cursor-pointer hover:text-blue-800"
          >
            NÃO
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            SIM
          </button>
        </div>
      </div>
    </div>
  );
};
