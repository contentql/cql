import { Field } from 'payload'

export type SlugField = (params: {
  fieldToUse: string
  prefix?: string
  suffix?: string
  overrides?: Partial<Field>
}) => Field

export type SlugModeField = (overrides?: Partial<Field>) => Field
