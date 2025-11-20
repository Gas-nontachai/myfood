import { format, parseISO } from 'date-fns';

export function formatDate(value: string | Date, pattern = 'MMM d, yyyy h:mm a'): string {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, pattern);
}
