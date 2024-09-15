import deepMerge from 'deepmerge';
import type { Field } from 'payload';

import { formatSlug } from './hooks/formatSlug.js';
import { SlugField } from './types.js';

/**
 * Creates a configuration object for a "slug" field in Payload CMS with optional overrides.
 *
 * This function uses the `deepMerge` utility to combine default field settings with any provided overrides.
 * It configures a "slug" field with properties such as name, label, type, and admin-specific settings.
 * It also sets up a hook for formatting the slug before validation.
 *
 * @param {string} fieldToUse - The field to use for generating the slug. This is included in the clientProps for the custom field component.
 * @param {Partial<Field>} [overrides={}] - Optional overrides to customize the default field configuration. These overrides are merged with the default configuration.
 * @returns {Field} - The complete field configuration object, including default settings and any provided overrides.
 *
 * @example
 * // Example with custom field settings and overrides
 * slugField('username', {
 *   name: 'username',
 *   label: 'Username',
 *   type: 'text',
 *   saveToJWT: true,
 *   required: true,
 *   unique: true,
 *   admin: {
 *     readOnly: false,
 *     position: undefined,
 *   },
 * });
 *
 * // The `customSlugField` object will contain merged configurations
 * // with the base "slug" field settings and the provided overrides,
 * // including a custom name, label, and additional properties.
 */
const slugField: SlugField = (fieldToUse, overrides = {}) => {
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
        condition: (data) => {
          return !data?.isHome && !data?.isDynamic;
        },
        components: {
          Field: {
            path: 'cql-core/client#CustomSlugField',
            clientProps: {
              fieldToUse: String(fieldToUse),
            },
          },
        },
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  );
};

export default slugField;
