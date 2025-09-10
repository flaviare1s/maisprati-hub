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
    const res = await api.get(`/timeslots/days/${date}`, {
      params: { adminId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    return res.data?.slots || [];
  } catch (error) {
    console.error("Erro ao buscar slots:", error.response || error);
    throw error;
  }
};

// Disponibilizar novos horários para um dia (admin)
export const createTimeSlots = async (adminId, date, slots) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post(
      `/timeslots/days`,
      slots, // lista de slots no body
      {
        params: { adminId, date },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Erro ao criar slots:", error.response || error);
    throw error;
  }
};

// Atualizar disponibilidade de um horário (professor/admin)
export const updateTimeSlotAvailability = async (date, time, available) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const adminId = user?.id;

    if (!adminId) {
      console.error("Usuário/adminId não encontrado!");
      return;
    }

    const url = `/timeslots/${date}/${time}/${available ? "book" : "release"}`;
    
    const res = await api.patch(url, null, {
      params: { adminId },
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("Erro Axios:", error.response || error);
    throw error;
  }
};

// Reservar horário para aluno ou time
export const bookTimeSlot = async (studentId, adminId, date, time) => {
  try {
    const token = localStorage.getItem("token");

    await api.patch(`/timeslots/${date}/${time}/book`, null, {
      params: { adminId },
      headers: { Authorization: `Bearer ${token}` },
    });

    // Buscar todos os times e verificar se o aluno está em algum time
    const teamsRes = await api.get("/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const teams = teamsRes.data;
    const userTeam = teams.find((team) =>
      team.members?.some(
        (member) => member.userId.toString() === studentId.toString()
      )
    );

    let createdAppointments = [];
    if (userTeam) {
      for (const member of userTeam.members) {
        const appointment = {
          studentId: member.userId,
          adminId,
          date,
          time,
        };
        const res = await api.post(`/appointments`, appointment, {
          headers: { Authorization: `Bearer ${token}` },
        });
        createdAppointments.push(res.data);
      }
      return createdAppointments;
    } else {
      const appointment = { studentId, adminId, date, time };
      const res = await api.post(`/appointments`, appointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    }
  } catch (error) {
    console.error("Erro ao reservar horário:", error.response || error);
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

    const token = localStorage.getItem("token");

    const actualType = type === "teacher" ? "admin" : type;
    const params =
      actualType === "admin" ? { adminId: userId } : { studentId: userId };

    const appointmentsRes = await api.get(`/appointments`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    const appointments = appointmentsRes.data;

    if (!appointments.length) return [];

    const usersRes = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = usersRes.data;

    const teamsRes = await api.get("/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });
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
  if (!adminId) return [];

  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/timeslots/month", {
      params: { adminId, year, month },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // array de TimeSlotDay
  } catch (error) {
    console.error("Erro ao buscar slots do mês:", error.response || error);
    return [];
  }
};

