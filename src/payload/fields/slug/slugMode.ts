import { CustomField } from '../../../core/payload-overrides.js'
import deepMerge from 'deepmerge'

import { SlugModeField } from './types.js'

/**
 * Creates a configuration object for a "slugMode" field in Payload CMS with optional overrides.
 *
 * This function uses the `deepMerge` utility to combine default field settings with any provided overrides.
 * It configures a "slugMode" field with properties such as name, label, type, options, and admin-specific settings.
 *
 * **Warning:** Do not modify the `name` or `options` properties in the overrides. Changing these properties may
 * affect the slug field generation and lead to unexpected behavior.
 *
 * @param {Partial<CustomField>} [overrides={}] - Optional overrides to customize the default field configuration. These overrides are merged with the default configuration.
 * @returns {CustomField} - The complete field configuration object, including default settings and any provided overrides.
 *
 * @example
 * // Example with custom field settings and overrides, but not altering 'name' or 'options'
 * slugModeField({
 *   label: 'Custom Slug Mode Label',
 *   defaultValue: 'custom',
 *   admin: {
 *     layout: 'vertical',
 *   },
 * });
 *
 * // The `customSlugModeField` object will contain merged configurations
 * // with the base "slugMode" field settings and the provided overrides,
 * // including a custom label and admin layout, but keeping the default 'name' and 'options' settings.
 */
const slugModeField: SlugModeField = (overrides = {}) =>
  deepMerge<CustomField, Partial<CustomField>>(
    {
      name: 'slugMode',
      label: 'Slug Mode',
      type: 'radio',
      options: [
        {
          label: 'Generate',
          value: 'generate',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      defaultValue: 'generate',
      admin: {
        position: 'sidebar',
        layout: 'horizontal',
        components: {
          Field: {
            path: '@contentql/core/client#CustomSlugModeField',
          },
        },
      },
    },
    overrides,
  )

export default slugModeField
