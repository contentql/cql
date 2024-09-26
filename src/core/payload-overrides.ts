import type {
  GlobalConfig,
  OptionObject,
  CollectionConfig as PayloadCollectionConfig,
  Field as PayloadField,
  RadioField as PayloadRadioField,
  SelectField as PayloadSelectField,
  SelectFieldManyValidation,
  SelectFieldSingleValidation,
} from 'payload'

// Custom SelectField type with OptionObject[] and correct validate function
export type CustomSelectField = Omit<
  PayloadSelectField,
  'options' | 'hasMany' | 'validate'
> & {
  options: OptionObject[]
  hasMany?: false | undefined // For single-select only
  validate?: SelectFieldSingleValidation | undefined
}

// Custom MultiSelectField with hasMany as true and correct validate function
export type CustomMultiSelectField = Omit<
  PayloadSelectField,
  'options' | 'hasMany' | 'validate'
> & {
  options: OptionObject[]
  hasMany: true // For multi-select only
  validate?: SelectFieldManyValidation | undefined
}

// Custom RadioField type with OptionObject[]
export type CustomRadioField = Omit<PayloadRadioField, 'fields'> & {
  options: OptionObject[]
}

// Exclude the default RadioField and SelectField and replace with custom versions
export type CustomField =
  | Exclude<PayloadField, PayloadRadioField | PayloadSelectField>
  | CustomRadioField
  | CustomSelectField
  | CustomMultiSelectField

// Update the CollectionConfig type by using the custom Field type
export type CustomCollectionConfig = Omit<PayloadCollectionConfig, 'fields'> & {
  fields: CustomField[]
}

export type CustomGlobalConfig = Omit<GlobalConfig, 'fields'> & {
  fields: CustomField[]
}
