import deepMerge from 'deepmerge'
import { Field } from 'payload'

import { formatSlug } from './hooks/formatSlug.js'
import { SlugField } from './types.js'

/**
 * Generates a configuration object for a "slug" field in Payload CMS with optional overrides.
 *
 * This function merges default field settings with any provided overrides using the `deepMerge` utility.
 * The resulting configuration includes settings such as name, label, type, and admin-specific options.
 * Additionally, a hook is added to format the slug before validation.
 *
 * @param {Object} params - The parameters for configuring the slug field.
 * @param {string} [params.fieldToUse] - The field to use for generating the slug, used in the clientProps for the custom field component.
 * @param {string} [params.prefix] - Optional prefix to prepend to the slug.
 * @param {string} [params.suffix] - Optional suffix to append to the slug.
 * @param {Partial<Field>} [params.overrides={}] - Optional overrides to customize the default field configuration. These overrides are merged with the default configuration.
 *
 * @returns {Field} - The complete field configuration object, including default settings and any provided overrides.
 *
 * @example
 * // Example usage with custom field settings and overrides
 * const customSlugField = slugField({
 *   fieldToUse: 'username',
 *   prefix: 'user-',
 *   suffix: '-profile',
 *   overrides: {
 *     name: 'usernameSlug',
 *     label: 'Username Slug',
 *     required: true,
 *     unique: true,
 *     admin: {
 *       readOnly: false,
 *     },
 *   },
 * });
 *
 * // The `customSlugField` object will contain the merged configurations,
 * // with the base "slug" field settings and the provided overrides.
 */

const slugField: SlugField = ({
  fieldToUse,
  prefix,
  suffix,
  overrides = {},
}) => {
  return deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      required: false,
      admin: {
        description: 'Contains only lowercase letters, numbers, and dashes.',
        position: 'sidebar',
        components: {
          Field: {
            path: '@contentql/core/client#CustomSlugField',
            clientProps: {
              fieldToUse: String(fieldToUse),
            },
          },
        },
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse, prefix, suffix)],
      },
    },
    overrides,
  )
}

export default slugField
