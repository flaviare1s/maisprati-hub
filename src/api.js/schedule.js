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

  // Buscar todos os times e verificar se o aluno está em algum time
  const teamsRes = await api.get("/teams");
  const teams = teamsRes.data;
  const userTeam = teams.find(
    (team) =>
      team.members &&
      team.members.some(
        (member) => member.userId.toString() === studentId.toString()
      )
  );

  let createdAppointments = [];
  if (userTeam) {
    // Criar agendamento para cada membro do time
    for (const member of userTeam.members) {
      const appointment = {
        studentId: member.userId,
        teacherId,
        date,
        time,
      };
      const res = await api.post(`/appointments`, appointment);
      createdAppointments.push(res.data);
    }
    return createdAppointments;
  } else {
    // Criar agendamento apenas para o aluno
    const appointment = {
      studentId,
      teacherId,
      date,
      time,
    };
    const res = await api.post(`/appointments`, appointment);
    return res.data;
  }
};

// Buscar agendamentos com dados completos (nome do aluno e time)
export const fetchAppointments = async (userId, role) => {
  try {
    const params =
      role === "teacher" ? { teacherId: userId } : { studentId: userId };

    // 1. Buscar agendamentos
    const appointmentsRes = await api.get(`/appointments`, { params });
    const appointments = appointmentsRes.data;

    if (appointments.length === 0) return [];

    // 2. Buscar todos os usuários
    const usersRes = await api.get("/users");
    const users = usersRes.data;

    // 3. Buscar todos os times
    const teamsRes = await api.get("/teams");
    const teams = teamsRes.data;

    // 4. Enriquecer os agendamentos com dados do aluno e time
    const enrichedAppointments = appointments.map((appointment) => {
      // Encontrar o usuário que fez o agendamento
      const student = users.find((user) => user.id == appointment.studentId);

      // Encontrar o time do usuário pelo userId na lista de membros
      let teamName = "Sem time";
      const team = teams.find(
        (team) =>
          team.members &&
          team.members.some((member) => member.userId == appointment.studentId)
      );
      if (team) {
        teamName = team.name;
      }

      return {
        ...appointment,
        studentName: student ? student.name : "Usuário não encontrado",
        studentCodename: student ? student.codename : "",
        teamName: teamName,
      };
    });

    return enrichedAppointments;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
};
