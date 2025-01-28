import type { PluginConfig as FormBuilderPluginConfig } from '@payloadcms/plugin-form-builder/types'
import type { Block, CollectionConfig, Field } from 'payload'

export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

export interface CustomFormOverrides
  extends Partial<Omit<CollectionConfig, 'fields'>> {
  fields?: FieldsOverride
  blocks?: Block[]
}

export interface CustomFormBuilderPluginConfig extends FormBuilderPluginConfig {
  formOverrides?: CustomFormOverrides
}
