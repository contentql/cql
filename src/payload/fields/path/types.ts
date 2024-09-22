import type { CustomField } from "../../../core/payload-overrides.js";

export type PathField = (overrides?: Partial<CustomField>) => CustomField;
export type PathModeField = (overrides?: Partial<CustomField>) => CustomField;
