import { CustomField } from '../../../core/payload-overrides.js'

export type SlugField = (params: {
  fieldToUse: string
  prefix?: string
  suffix?: string
  overrides?: Partial<CustomField>
}) => CustomField

export type SlugModeField = (overrides?: Partial<CustomField>) => CustomField
