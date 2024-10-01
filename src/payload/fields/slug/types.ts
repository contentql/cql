import { CustomField } from 'src/core/payload-overrides'

export type SlugField = (params: {
  fieldToUse: string
  prefix?: string
  suffix?: string
  overrides?: Partial<CustomField>
}) => CustomField

export type SlugModeField = (overrides?: Partial<CustomField>) => CustomField
