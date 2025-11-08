import { format } from 'date-fns';

/**
 * Safely format date range from YYYY-MM-DD strings without timezone conversion
 * This prevents off-by-one errors when displaying statement periods
 */
export function formatDateRange(startDate: string | null, endDate: string | null): string | null {
  if (!startDate || !endDate) return null;
  
  // Parse YYYY-MM-DD strings without timezone conversion
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
  
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  
  return `${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`;
}

/**
 * Safely format a single date from YYYY-MM-DD string
 */
export function formatDate(dateString: string | null, formatString: string = 'MMM dd, yyyy'): string | null {
  if (!dateString) return null;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return format(date, formatString);
}
