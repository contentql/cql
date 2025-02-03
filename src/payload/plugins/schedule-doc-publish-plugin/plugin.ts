import type { CollectionSlug, Config, Plugin } from 'payload'

import { publishOnField } from './fields/publishOn/index.js'
import { triggerScheduleAfterChange } from './hooks/triggerScheduleAfterChange.js'
import { PluginTypes } from './types.js'

/**
 * Creates a Payload CMS plugin to add a "Publish On" field to specified collections and handle scheduling jobs.
 *
 * @param {boolean} [options.enabled=true] - Flag to enable or disable the plugin. Defaults to `true`.
 * @param {CollectionSlug[]} options.collections - An array of collection slugs to which the "Publish On" field will be added.
 * @param {Position} [options.position='sidebar'] - Position of the "Publish On" field in the admin UI. Accepted values are 'sidebar', 'start', or 'end'. Defaults to 'sidebar'.
 *
 * @returns {Plugin} A Payload CMS plugin configuration function that modifies the incoming configuration.
 *
 * @description
 * This plugin modifies the Payload CMS configuration to:
 * - Add a "Publish On" field to the specified collections. The field can be placed at the 'start', 'sidebar', or 'end' of the collection fields.
 * - Hook into the `afterChange` event of these collections to schedule or reschedule jobs based on the value of the "Publish On" field.
 *
 * @example
 * // Example usage of the plugin in `payload.config.ts`
 *
 * export default buildConfig({
 *   collections: [Articles, News],
 *   plugins: [
 *     scheduleDocPublish({
 *       enable: true,
 *       collections: ['articles', 'news'],
 *       position: 'sidebar',
 *     }),
 *   ],
 *   secret: env.PAYLOAD_SECRET,
 *   db: mongooseAdapter({ url: env.DATABASE_URI }),
 * })
 */
const plugin =
  (options: PluginTypes): Plugin =>
  (incomingConfig: Config): Config => {
    const { enabled = true, collections = [], position = 'sidebar' } = options

    if (!enabled) {
      return incomingConfig
    }

    const updatedCollections = incomingConfig.collections?.map(collection => {
      if (collections.includes(collection.slug as CollectionSlug)) {
        const fields =
          position === 'start'
            ? [publishOnField, ...collection.fields]
            : [...collection.fields, publishOnField]

        return {
          ...collection,
          fields,
          hooks: {
            ...collection.hooks,
            afterChange: [
              ...(collection.hooks?.afterChange || []),
              triggerScheduleAfterChange,
            ],
          },
        }
      }

      return collection
    })

    return {
      ...incomingConfig,
      collections: updatedCollections,
    }
  }

export default plugin
