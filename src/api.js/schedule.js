import api from "../services/api";

// Buscar slots de um dia
export const fetchTimeSlots = async (teacherId, date) => {
  const res = await api.get(`/timeSlots`, {
    params: { teacherId, date },
  });
  return res.data[0]?.slots || [];
};

// Atualizar disponibilidade de um horário (professor)
export const updateTimeSlotAvailability = async (
  teacherId,
  date,
  time,
  available
) => {
  // 1. Buscar os slots do dia
  const res = await api.get(`/timeSlots`, {
    params: { teacherId, date },
  });
  let daySlots = res.data[0];

  // Se o dia não existir ainda, cria um novo
  if (!daySlots) {
    daySlots = { teacherId, date, slots: [] };
  }

  // 2. Atualiza ou cria o slot
  const slotIndex = daySlots.slots.findIndex((s) => s.time === time);
  if (slotIndex > -1) {
    daySlots.slots[slotIndex].available = available;
  } else {
    daySlots.slots.push({ time, available, booked: false });
  }

  // 3. Persistir no back-end
  if (daySlots.id) {
    // Se já existe no banco, atualiza
    await api.put(`/timeSlots/${daySlots.id}`, daySlots);
  } else {
    // Se não existe, cria novo
    await api.post(`/timeSlots`, daySlots);
  }

  return daySlots;
};

// Reservar horário (aluno)
export const bookTimeSlot = async (studentId, teacherId, date, time) => {
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
  daySlots.slots[slotIndex].booked = true; // marca como agendado
  await api.put(`/timeSlots/${daySlots.id}`, daySlots);

  // Criar agendamento
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
