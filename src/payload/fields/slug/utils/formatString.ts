import slugify from 'slugify'

export const formatString = (
  value: string,
  options: { trim: boolean } = { trim: false },
): string => {
  const formattedString = slugify(value, {
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: 'en',
    trim: options.trim,
    replacement: '-',
  })

  return formattedString
}
