import { Field } from 'payload'

export const currencies = [
  { label: 'US Dollar ($)', value: 'usd' },
  { label: 'Euro (€)', value: 'eur' },
  { label: 'Indian Rupee (₹)', value: 'inr' },
  { label: 'British Pound (£)', value: 'gbp' },
  { label: 'Japanese Yen (¥)', value: 'jpy' },
  { label: 'Canadian Dollar (CA$)', value: 'cad' },
  { label: 'Australian Dollar (A$)', value: 'aud' },
  { label: 'Swiss Franc (CHF)', value: 'chf' },
  { label: 'Chinese Yuan (¥)', value: 'cny' },
  { label: 'Hong Kong Dollar (HK$)', value: 'hkd' },
  { label: 'Singapore Dollar (S$)', value: 'sgd' },
  { label: 'Mexican Peso (MX$)', value: 'mxn' },
  { label: 'Brazilian Real (R$)', value: 'brl' },
  { label: 'Russian Ruble (₽)', value: 'rub' },
  { label: 'South Korean Won (₩)', value: 'krw' },
  { label: 'South African Rand (R)', value: 'zar' },
  { label: 'Turkish Lira (₺)', value: 'try' },
  { label: 'Saudi Riyal (﷼)', value: 'sar' },
  { label: 'United Arab Emirates Dirham (د.إ)', value: 'aed' },
  { label: 'Polish Zloty (zł)', value: 'pln' },
] as const

// Formats the currency
export const formatCurrency = ({
  amount,
  currencyCode,
  options = {},
}: {
  amount: number
  currencyCode: (typeof currencies)[number]['value']
  options?: Intl.NumberFormatOptions
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
    ...options,
  })
  return formatter.format(amount)
}

export const currencyField: Field = {
  name: 'currency',
  type: 'select',
  options: currencies.map(currency => currency),
  defaultValue: 'usd',
  required: true,
  admin: {
    description:
      'This field is used to format currency values & used as default currency for ecommerce-theme',
  },
}
