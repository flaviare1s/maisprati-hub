import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TimeSlotModal } from './TimeSlotModal';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useAuth } from '../hooks/useAuth';

dayjs.locale('pt-br');

export const Calendar = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalOpen, setModalOpen] = useState(false);

  const adminId = user?.type === "admin" ? user.id : null;

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (!newDate.isBefore(dayjs(), 'day')) setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const getSelectedDateInfo = () => {
    const today = dayjs();
    const isPast = selectedDate.isBefore(today, 'day');
    const isToday = selectedDate.isSame(today, 'day');
    const isWeekend = selectedDate.day() === 0 || selectedDate.day() === 6;

    if (isPast) return { status: 'Passado', color: '#aaa' };
    if (isWeekend) return { status: 'Fim de semana', color: '#555' };
    if (isToday) return { status: 'Hoje', color: '#007DE3' };
    return { status: 'Futuro', color: '#007DE3' };
  };

  const CustomPickersDay = ({ day, outsideCurrentMonth, ...other }) => {
    const today = dayjs();
    const isToday = day.isSame(today, 'day');
    const isPast = day.isBefore(today, 'day');
    const isWeekend = day.day() === 0 || day.day() === 6;

    let color = '#444';
    let isClickable = true;

    if (outsideCurrentMonth || isPast) {
      color = '#ccc';
      isClickable = false;
    } else if (isToday) {
      color = '#007de3';
    } else if (isWeekend) {
      color = '#555';
    }

    return (
      <PickersDay
        {...other}
        day={day}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          color,
          fontWeight: isToday ? 'bold' : '500',
          '&.Mui-selected': {
            backgroundColor: '#FE8822',
            color: '#fff',
          },
          pointerEvents: isClickable ? 'auto' : 'none',
        }}
        disabled={!isClickable}
      />
    );
  };

  return (
  
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Card
          sx={{
            width: '100%',
            maxWidth: '100%',
            mx: 'auto',
          backgroundColor: '#f3f4f6',
            borderRadius: 2,
            p: 0,
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center', color: 'text.primary' }}
            >
              Calendário
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                slots={{ day: CustomPickersDay }}
                sx={{
                  '& .MuiPickersCalendarHeader-root': { color: 'text.primary', mb: 1 },
                  '& .MuiDayCalendar-header .MuiTypography-root': { color: 'text.secondary', fontWeight: 600 },
                }}
              />
            </Box>

            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: 'block',
                textAlign: 'center',
                color: getSelectedDateInfo().color,
                fontWeight: 500,
              }}
            >
              {selectedDate.format('DD/MM/YYYY')} - {getSelectedDateInfo().status}
            </Typography>
          </CardContent>
        </Card>

        <TimeSlotModal
          open={modalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate}
          adminId={adminId}
          studentId={user?.id || 0} // usuário logado, fallback 0
        />
      </LocalizationProvider>

  );
};
