import deepMerge from 'deepmerge'
import { Field } from 'payload'

import { LayoutField } from './types.js'

/**
 * Creates a configuration object for a "layout" field in Payload CMS with optional overrides.
 *
 * This function generates a configuration object for a "layout" field, which allows the user to select and configure blocks for a page layout.
 * It uses the `deepMerge` utility to combine default field settings with any provided overrides. The default configuration includes a minimum
 * of one block and utilizes pre-defined `blocks`.
 *
 * @param {Partial<Field>} [overrides={}] - Optional overrides to customize the default field configuration. These overrides are merged with the default configuration.
 * @returns {Field} - The complete field configuration object, including default settings and any provided overrides.
 *
 * @example
 * // Example with custom field settings and overrides
 * layoutField({
 *   label: 'Custom Page Layout',
 *   minRows: 2,
 *   admin: {
 *     layout: 'vertical',
 *   },
 * });
 *
 * // The `customLayoutField` object will contain merged configurations
 * // with the base "layout" field settings and the provided overrides,
 * // including a custom label, minimum rows, and admin layout.
 */
const layoutField: LayoutField = (overrides = {}) => {
  return deepMerge<Field, Partial<Field>>(
    {
      name: 'layout',
      label: 'Page Layout',
      type: 'blocks',
      minRows: 1,
      blocks: [],
    },
    overrides,
  )
}

export default layoutField
