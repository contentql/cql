import deepmerge from "deepmerge";

import { PathModeField } from "./types.js";
import { CustomField } from "../../../core/payload-overrides.js";

/**
 * Creates a configuration object for a "pathMode" field in Payload CMS with optional overrides.
 *
 * This function generates a configuration object for a "pathMode" field, which is a radio button field allowing selection
 * between automatic path generation and manual customization of the path. The default configuration includes options such as
 * "Generate" and "Custom" with a default value of "generate".
 *
 * The function uses the `deepmerge` utility to combine default field settings with any provided overrides. Admin-specific
 * settings include the position of the field in the sidebar and a horizontal layout.
 *
 * **Note:** Avoid changing the name or options of this field, as it may affect path generation and customization logic.
 *
 * @param {Partial<CustomField>} [overrides={}] - Optional overrides to customize the default field configuration. These overrides are merged with the default configuration.
 * @returns {CustomField} - The complete field configuration object, including default settings and any provided overrides.
 *
 * @example
 * // Example with custom field settings and overrides
 * const customPathModeField = pathModeField({
 *   label: 'Custom Path Mode',
 *   defaultValue: 'custom',
 *   admin: {
 *     layout: 'vertical',
 *   },
 * });
 *
 * // The `customPathModeField` object will contain merged configurations
 * // with the base "pathMode" field settings and the provided overrides,
 * // including a custom label, default value, and admin layout.
 */
const pathModeField: PathModeField = (overrides = {}) =>
  deepmerge<CustomField, Partial<CustomField>>(
    {
      name: "pathMode",
      label: "Path Mode",
      type: "radio",
      options: [
        {
          label: "Generate",
          value: "generate",
        },
        {
          label: "Custom",
          value: "custom",
        },
      ],
      defaultValue: "generate",
      admin: {
        position: "sidebar",
        layout: "horizontal",
      },
    },
    overrides
  );

export default pathModeField;
