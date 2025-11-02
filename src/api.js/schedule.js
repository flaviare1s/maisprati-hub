import api from "../services/api";

// Buscar slots de um dia
export const fetchTimeSlots = async (adminId, date) => {
  if (!date) {
    console.error("Data não fornecida!");
    return [];
  }
  if (!adminId) {
    console.error("AdminId não fornecido!");
    return [];
  }

  try {
    let url = `/timeslots/days/${date}`;
    let res;

    try {
      res = await api.get(url, {
        params: { adminId },
      });
      if (res.data?.slots && res.data.slots.length > 0) {
        return res.data.slots;
      }
    } catch (firstError) {
      console.error(
        "Primeira tentativa falhou, tentando formato alternativo...",
        firstError
      );
    }

    const dateObj = new Date(date + "T00:00:00.000Z");
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;

    const monthRes = await api.get("/timeslots/month", {
      params: { adminId, year, month },
    });

    const targetDate = date;
    const dayData = monthRes.data.find((day) => {
      const dayDate = new Date(day.date).toISOString().split("T")[0];
      return dayDate === targetDate;
    });

    return dayData?.slots || [];
  } catch (error) {
    console.error("Erro ao buscar slots:", error);
    return [];
  }
};

// Disponibilizar novos horários para um dia (admin)
export const createTimeSlots = async (adminId, date, slots) => {
  if (!date) {
    console.error("Data não fornecida para criação de slots!");
    return;
  }
  if (!adminId) {
    console.error("AdminId não fornecido para criação de slots!");
    return;
  }

  try {
    const res = await api.post(`/timeslots/days`, slots, {
      params: { adminId, date },
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao criar slots:", error.response || error);
    throw error;
  }
};

// Atualizar disponibilidade de um horário (professor/admin)
export const updateTimeSlotAvailability = async (
  date,
  time,
  available,
  adminId
) => {
  if (!adminId) {
    console.error("adminId não fornecido!");
    return;
  }
  if (!date) {
    console.error("Data não fornecida para atualização de slot!");
    return;
  }
  if (!time) {
    console.error("Hora não fornecida para atualização de slot!");
    return;
  }

  try {
    const url = `/timeslots/${date}/${time}/${available ? "book" : "release"}`;
    const res = await api.patch(url, null, {
      params: { adminId },
    });

    return res.data;
  } catch (error) {
    console.error("Erro Axios:", error.response || error);
    throw error;
  }
};

// Buscar agendamentos com dados completos
export const fetchAppointments = async (userId, type) => {
  try {
    if (!userId) {
      console.error("UserId não fornecido!");
      return [];
    }

    const actualType = type === "teacher" ? "admin" : type;
    const params =
      actualType === "admin" ? { adminId: userId } : { studentId: userId };

    const appointmentsRes = await api.get(`/appointments`, { params });
    const appointments = appointmentsRes.data;

    if (!appointments.length) return [];

    const usersRes = await api.get("/users");
    const users = usersRes.data;

    const teamsRes = await api.get("/teams");
    const teams = teamsRes.data;

    return appointments.map((appointment) => {
      const student = users.find((u) => u.id === appointment.studentId);
      let teamName = "Sem time";
      const team = teams.find((t) =>
        t.members?.some((m) => m.userId === appointment.studentId)
      );
      if (team) teamName = team.name;

      return {
        ...appointment,
        studentName: student?.name || "Usuário não encontrado",
        studentCodename: student?.codename || "",
        teamName,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error.response || error);
    throw error;
  }
};

// Buscar dias do mês do admin
export const fetchMonthSlots = async (adminId, year, month) => {
  if (!adminId) {
    console.error("AdminId não fornecido para buscar slots do mês!");
    return [];
  }

  try {
    const res = await api.get("/timeslots/month", {
      params: { adminId, year, month },
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar slots do mês:", error.response || error);
    return [];
  }
};
