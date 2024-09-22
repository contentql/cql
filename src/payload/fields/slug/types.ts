import { CustomField } from "../../../core/payload-overrides.js";

export type SlugField = (
  fieldToUse?: string,
  overrides?: Partial<CustomField>
) => CustomField;

export type SlugModeField = (overrides?: Partial<CustomField>) => CustomField;
