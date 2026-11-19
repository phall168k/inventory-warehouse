export type NumberInput = number | string | null | undefined

export interface NumberFormatterOptions extends Intl.NumberFormatOptions {
  locale?: string
}

/** Format a number with grouping and up to five decimal places by default. */
export const formatNumber = (
  value: NumberInput,
  options: NumberFormatterOptions = {},
): string => {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return '—'

  const number = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(number)) return '—'

  const { locale = 'en-US', ...formatOptions } = options
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.max(5, formatOptions.minimumFractionDigits ?? 0),
    ...formatOptions,
  }).format(number)
}
