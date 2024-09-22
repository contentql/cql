import type { CustomField } from "../../../core/payload-overrides.js";

export type LayoutField = (overrides?: Partial<CustomField>) => CustomField;
