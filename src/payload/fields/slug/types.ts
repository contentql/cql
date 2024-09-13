import { Field } from 'payload'

export type SlugField = (
  fieldToUse?: string,
  overrides?: Partial<Field>,
) => Field

export type SlugModeField = (overrides?: Partial<Field>) => Field
