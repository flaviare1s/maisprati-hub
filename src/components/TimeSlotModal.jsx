import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { bookTimeSlot, fetchTimeSlots } from '../api.js/schedule';

export const TimeSlotModal = ({ open, onClose, selectedDate, teacherId, studentId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !selectedDate) return;

    const loadSlots = async () => {
      setLoading(true);
      try {
        const slots = await fetchTimeSlots(teacherId, selectedDate.format('YYYY-MM-DD'));
        setTimeSlots(slots);
      } catch (error) {
        toast.error('Erro ao carregar horários');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [open, selectedDate, teacherId]);

  const handleTimeSlotClick = async (slot) => {
    if (!slot.available) return;

    try {
      await bookTimeSlot(studentId, teacherId, selectedDate.format('YYYY-MM-DD'), slot.time);
      toast.success(`Horário ${slot.time} reservado com sucesso!`);
      setTimeSlots(prev => prev.map(s =>
        s.time === slot.time ? { ...s, available: false } : s
      ));
      onClose();
    } catch (error) {
      toast.error(error.message || 'Erro ao reservar horário');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {selectedDate ? selectedDate.format('DD/MM/YYYY') : ''}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-500 text-sm mb-6">
            {loading ? 'Carregando horários...' : 'Selecione um horário disponível'}
          </p>

          {!loading && (
            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {timeSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTimeSlotClick(slot)}
                  disabled={!slot.available}
                  className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${slot.available
                      ? 'text-blue-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border border-blue-300'
                      : 'bg-red-50 text-red-500 border border-red-200 opacity-60 cursor-not-allowed'
                    }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}

          {!loading && (
            <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-xs text-gray-500">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-gray-500">Ocupado</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
