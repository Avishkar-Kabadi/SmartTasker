import { format, isToday, isTomorrow, parseISO, addDays, formatRelative } from 'date-fns';

export const formatDateDisplay = (dateString: string | null) => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
};

export const formatTimeDisplay = (timeString: string | null) => {
  if (!timeString) return '';
  const [h, m] = timeString.split(':');
  const d = new Date();
  d.setHours(parseInt(h, 10));
  d.setMinutes(parseInt(m, 10));
  return format(d, 'h:mm a');
};

export const getRelativeDueDate = (dateString: string | null, timeString: string | null) => {
  if (!dateString) return 'No due date';
  
  const date = parseISO(dateString);
  if (timeString) {
      const [h, m] = timeString.split(':');
      date.setHours(parseInt(h, 10));
      date.setMinutes(parseInt(m, 10));
  }
  
  return formatRelative(date, new Date());
};
