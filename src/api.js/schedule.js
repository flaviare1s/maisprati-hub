import api from "../services/api";

export const fetchTimeSlots = async (teacherId, date) => {
  const res = await api.get(`/timeSlots`, {
    params: { teacherId, date },
  });
  return res.data[0]?.slots || [];
};

// Reservar horário
export const bookTimeSlot = async (studentId, teacherId, date, time) => {
  // 1. Atualiza o slot para indisponível
  const slotsRes = await api.get(`/timeSlots`, {
    params: { teacherId, date },
  });
  const daySlots = slotsRes.data[0];

  if (!daySlots) throw new Error("Dia não encontrado");

  const slotIndex = daySlots.slots.findIndex((s) => s.time === time);
  if (slotIndex === -1 || !daySlots.slots[slotIndex].available) {
    throw new Error("Horário não disponível");
  }

  daySlots.slots[slotIndex].available = false;
  await api.put(`/timeSlots/${daySlots.id}`, daySlots);

  // 2. Criar agendamento
  const appointment = {
    studentId,
    teacherId,
    date,
    time,
  };
  const res = await api.post(`/appointments`, appointment);
  return res.data;
};

// Buscar agendamentos
export const fetchAppointments = async (userId, role) => {
  const params =
    role === "teacher" ? { teacherId: userId } : { studentId: userId };
  const res = await api.get(`/appointments`, { params });
  return res.data;
};
