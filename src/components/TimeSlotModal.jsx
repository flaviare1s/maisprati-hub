import { X } from 'lucide-react';
import toast from 'react-hot-toast';

// Gerar horários para um dia específico
const getTimeSlots = () => {
  const slots = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  return slots.map(time => ({
    time,
    available: Math.random() > 0.3
  }));
};

export const TimeSlotModal = ({ open, onClose, selectedDate }) => {
  const timeSlots = selectedDate ? getTimeSlots() : [];

  const handleTimeSlotClick = (timeSlot) => {
    if (timeSlot.available) {
      toast.success(`Horário ${timeSlot.time} selecionado para ${selectedDate.format('DD/MM/YYYY')}`);
      onClose();
    } else {
      toast.error('Este horário não está disponível');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#0000005b] transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-light rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] border-2 border-blue-logo overflow-hidden">

        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {selectedDate ? selectedDate.format('DD/MM/YYYY') : ''}
          </h2>

          <button
            onClick={onClose}
            className="p-2 text-gray-muted cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-muted text-sm mb-6">
            Selecione um horário disponível
          </p>

          <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSlotClick(slot)}
                disabled={!slot.available}
                className={`
                  py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${slot.available
                    ? 'text-blue-logo hover:shadow-md hover:-translate-y-0.5 cursor-pointer border border-blue-logo'
                    : 'bg-red-50 text-red-secondary border border-red-200 opacity-60 cursor-not-allowed'
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-logo rounded-full" />
              <span className="text-xs text-gray-muted">Disponível</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-secondary rounded-full" />
              <span className="text-xs text-gray-muted">Ocupado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
