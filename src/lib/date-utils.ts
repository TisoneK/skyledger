/**
 * Date and time formatting utilities with localization support
 */

export interface DateTimeConfig {
  defaultTime?: string; // Default time in HH:mm format (e.g., "14:00")
  locale?: string; // User locale, defaults to browser locale
}

const DEFAULT_CONFIG: DateTimeConfig = {
  defaultTime: '14:00',
};

/**
 * Formats the current date with localized formatting
 * @param config - Configuration options
 * @returns Formatted date string (e.g., "31/01/2026")
 */
export function formatCurrentDate(config: DateTimeConfig = {}): string {
  const { locale } = { ...DEFAULT_CONFIG, ...config };
  const now = new Date();
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(now);
}

/**
 * Formats the default time with localization
 * @param config - Configuration options
 * @returns Formatted time string (e.g., "14:00")
 */
export function formatDefaultTime(config: DateTimeConfig = {}): string {
  const { defaultTime = '14:00', locale } = { ...DEFAULT_CONFIG, ...config };
  
  // Parse the default time and format it with locale
  const [hours, minutes] = defaultTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Gets the next Tuesday from current date
 * @returns Date object representing next Tuesday
 */
export function getNextTuesday(): Date {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 2 = Tuesday
  const daysUntilTuesday = (2 - currentDay + 7) % 7 || 7; // If today is Tuesday, get next week's Tuesday
  
  const nextTuesday = new Date(now);
  nextTuesday.setDate(now.getDate() + daysUntilTuesday);
  nextTuesday.setHours(14, 0, 0, 0); // Set to 14:00
  
  return nextTuesday;
}

/**
 * Checks if today is Tuesday
 * @returns boolean indicating if today is Tuesday
 */
export function isTodayTuesday(): boolean {
  return new Date().getDay() === 2;
}

/**
 * Formats the Chama Day display text
 * @param config - Configuration options
 * @returns Object with formatted date, time, and status text
 */
export function getChamaDayDisplay(config: DateTimeConfig = {}) {
  const today = isTodayTuesday();
  const nextTuesday = getNextTuesday();
  
  return {
    date: formatCurrentDate(config),
    time: formatDefaultTime(config),
    statusText: today ? 'Today!' : 'Next Tuesday',
    isToday: today,
    nextTuesdayDate: nextTuesday,
  };
}
