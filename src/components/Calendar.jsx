import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TimeSlotModal } from './TimeSlotModal';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const CustomPickersDay = (props) => {
  const { day, outsideCurrentMonth, ...other } = props;
  const today = dayjs();
  const isToday = day.isSame(today, 'day');
  const isPast = day.isBefore(today, 'day');
  const isFuture = day.isAfter(today, 'day');
  const isWeekend = day.day() === 0 || day.day() === 6; // Domingo ou Sábado

  let color = '#444444'; // Preto padrão
  let isClickable = true;

  if (outsideCurrentMonth) {
    color = '#ccc';
    isClickable = false;
  } else if (isPast) {
    color = '#999'; // Cinza para dias passados
    isClickable = false;
  } else if (isToday) {
    // Para o dia atual: azul se dia de semana, preto se fim de semana
    color = isWeekend ? '#000' : '#007DE3';
  } else if (isWeekend) {
    color = '#000'; // Preto para fins de semana
  } else if (isFuture) {
    color = '#007DE3'; // Azul para dias futuros
  }

  return (
    <PickersDay
      {...other}
      day={day}
      sx={{
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        color,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent !important',
        },
        '&.Mui-selected': {
          backgroundColor: '#FE8822',
          color: isToday ? (isWeekend ? '#000' : '#007DE3') : '#fff',
        },
        '&.MuiPickersDay-today': {
          border: '2px solid #FE8822',
          backgroundColor: 'transparent',
          color: isWeekend ? '#000' : '#007DE3', // Garantir cor correta no dia atual
          '&:hover': {
            backgroundColor: 'transparent !important',
          },
        },
        pointerEvents: isClickable ? 'auto' : 'none',
      }}
      disabled={!isClickable}
    />
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#007DE3',
    },
    secondary: {
      main: '#FE8C68',
    },
    background: {
      default: '#F3F4F6',
    },
    text: {
      primary: '#444444',
      secondary: '#777777',
    },
  },
});

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalOpen, setModalOpen] = useState(false);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const today = dayjs();
    const isPast = newDate.isBefore(today, 'day');

    // Só abre modal para dias atuais ou futuros
    if (!isPast) {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getSelectedDateInfo = () => {
    const today = dayjs();
    const isPast = selectedDate.isBefore(today, 'day');
    const isToday = selectedDate.isSame(today, 'day');
    const isWeekend = selectedDate.day() === 0 || selectedDate.day() === 6;

    if (isPast) {
      return { status: 'Passado', color: '#999' };
    } else if (isWeekend) {
      return { status: 'Fim de semana', color: '#000' };
    } else if (isToday) {
      return { status: 'Hoje', color: '#007DE3' };
    } else {
      return { status: 'Futuro', color: '#007DE3' };
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Card
          sx={{
            width: '100%',
            height: 'fit-content',
            backgroundColor: 'background.default',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          }}
        >
          <CardContent sx={{ padding: '16px' }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                marginBottom: '16px',
                color: 'text.primary',
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'var(--font-montserrat)',
              }}
            >
              Calendário
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                slots={{
                  day: CustomPickersDay,
                }}
                sx={{
                  '& .MuiPickersCalendarHeader-root': {
                    color: 'text.primary',
                    fontFamily: 'var(--font-montserrat)',
                  },
                  '& .MuiDayCalendar-header': {
                    '& .MuiTypography-root': {
                      color: 'text.secondary',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-montserrat)',
                    },
                  },
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                marginTop: '12px',
                color: getSelectedDateInfo().color,
                textAlign: 'center',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 'bold',
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
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
