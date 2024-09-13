import deepmerge from "deepmerge";
import type { Field } from "payload";

import { generateAndValidatePath } from "./hooks/generateAndValidatePath.js";
import { PathField } from "./types.js";

/**
 * Creates a configuration object for a "path" field in Payload CMS with optional overrides.
 *
 * This function generates a configuration object for a "path" field, which is a text field intended for unique paths.
 * The default configuration includes properties such as `unique`, `index`, and a custom hook for generating and validating
 * the path. It also supports admin-specific settings, including custom field components.
 *
 * The function uses the `deepmerge` utility to combine default field settings with any provided overrides.
 *
 * @param {Partial<Field>} [overrides={}] - Optional overrides to customize the default field configuration. These overrides are merged with the default configuration.
 * @returns {Field} - The complete field configuration object, including default settings and any provided overrides.
 *
 * @example
 * // Example with custom field settings and overrides
 * const customPathField = pathField({
 *   label: 'Custom Path Label',
 *   admin: {
 *     position: 'main',
 *   },
 * });
 *
 * // The `customPathField` object will contain merged configurations
 * // with the base "path" field settings and the provided overrides,
 * // including a custom label and admin position.
 */
const pathField: PathField = (overrides = {}) =>
  deepmerge<Field, Partial<Field>>(
    {
      type: "text",
      name: "path",
      unique: true,
      index: true,
      label: "Path",
      hooks: {
        beforeValidate: [generateAndValidatePath],
      },
      admin: {
        position: "sidebar",
        components: {
          Field: "cql/client#CustomPathField",
        },
      },
    },
    overrides
  );

export default pathField;
