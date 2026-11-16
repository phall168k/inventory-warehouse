export type DateInput = string | number | Date | null | undefined

export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
  locale?: string
}

/** Numbers are Unix timestamps in milliseconds. Missing or invalid dates display as an em dash. */
export const formatDate = (
  value: DateInput,
  options: DateFormatterOptions = {},
): string => {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return '—'

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const { locale = 'en-GB', ...formatOptions } = options
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Phnom_Penh',
    ...(formatOptions.dateStyle || formatOptions.timeStyle
      ? {}
      : { day: '2-digit', month: 'short', year: 'numeric' }),
    ...formatOptions,
  }).format(date)
}

/** Format a date with hours and minutes, using the same defaults as formatDate. */
export const formatDateTime = (
  value: DateInput,
  options: DateFormatterOptions = {},
): string => formatDate(value, {
  ...(options.dateStyle || options.timeStyle
    ? {}
    : { hour: '2-digit', minute: '2-digit', hour12: false }),
  ...options,
})
