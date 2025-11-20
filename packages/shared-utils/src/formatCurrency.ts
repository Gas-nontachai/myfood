export function formatCurrency(amountCents: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amountCents / 100);
}
