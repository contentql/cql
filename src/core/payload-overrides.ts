import type {
  RadioField as PayloadRadioField,
  SelectField as PayloadSelectField,
  Field as PayloadField,
  OptionObject,
  CollectionConfig as PayloadCollectionConfig,
  GlobalConfig,
} from "payload";

// Custom SelectField type with OptionObject[]
export type CustomSelectField = Omit<PayloadSelectField, "options"> & {
  options: OptionObject[];
};

// Custom RadioField type with OptionObject[]
export type CustomRadioField = Omit<PayloadRadioField, "fields"> & {
  options: OptionObject[];
};

// Exclude the default RadioField and SelectField and replace with custom versions
export type CustomField =
  | Exclude<PayloadField, PayloadRadioField | PayloadSelectField>
  | CustomRadioField
  | CustomSelectField;

// Update the CollectionConfig type by using the custom Field type
export type CustomCollectionConfig = Omit<PayloadCollectionConfig, "fields"> & {
  fields: CustomField[];
};

export type CustomGlobalConfig = Omit<GlobalConfig, "fields"> & {
  fields: CustomField[];
};
