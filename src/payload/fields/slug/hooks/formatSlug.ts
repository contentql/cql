import { FieldHook } from 'payload'
import { formatString } from '../utils/formatString'

export const formatSlug =
  (
    fallback: string,
    prefix: string | undefined,
    suffix: string | undefined,
  ): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    const valueWithPrefixAndSuffix = `${prefix ? prefix : ''}${value}${suffix ? suffix : ''}`
    const correctValue =
      operation === 'create' ? valueWithPrefixAndSuffix : value

    if (!fallback) {
      return formatString(correctValue)
    }

    if (data?.isHome) return 'home-page'

    if (typeof value === 'string' && value.length > 0) {
      return formatString(correctValue, { trim: true })
    }

    if (operation === 'create') {
      const fallbackData =
        (data && data[fallback]) || (originalDoc && originalDoc[fallback])

      const fallbackDataWithPrefixAndSuffix = `${prefix ? prefix : ''}${fallbackData}${suffix ? suffix : ''}`

      if (fallbackData && typeof fallbackData === 'string') {
        return formatString(fallbackDataWithPrefixAndSuffix, { trim: true })
      }
    }

    return value
  }
