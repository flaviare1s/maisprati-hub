import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchAppointments } from "../../api.js/schedule";
import { TimeSlotModal } from "../TimeSlotModal";

export const TeacherMeetingsTab = ({ teacherId }) => {
  const [selectedDate] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments(teacherId, "teacher");
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos", error);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-lg text-dark font-semibold mb-1">Gerenciar Reuniões</h3>
      <p className="text-gray-muted mb-3">Abra a agenda do dia para selecionar os horários disponíveis.</p>

      <div className="mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-logo text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Abrir Agenda do Dia
        </button>
      </div>

      <div className="grid gap-2">
        {appointments
          .sort((a, b) => dayjs(a.date + " " + a.time) - dayjs(b.date + " " + b.time))
          .map((appt, idx) => (
            <div
              key={idx}
              className="p-2 rounded text-sm border flex justify-between items-center text-dark"
            >
              <span>{dayjs(appt.date).format("DD/MM/YYYY")} - {appt.time}</span>
              <span className="text-green-700 font-medium">Agendado</span>
            </div>
          ))}
      </div>

      {modalOpen && (
        <TimeSlotModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          teacherId={teacherId}
          studentId={null}
        />
      )}

      <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-light rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-logorounded-full" />
          <span className="text-xs text-gray-muted">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs text-gray-muted">Agendado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
          <span className="text-xs text-gray-muted">Indisponível</span>
        </div>
      </div>
    </div>
  );
};
