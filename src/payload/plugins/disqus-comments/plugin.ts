import type { Config, Plugin } from 'payload'

import DisqusCommentsConfig from './blocks/Disqus/config'
import { PluginTypes } from './types'

const plugin =
  (options: PluginTypes): Plugin =>
  (incomingConfig: Config): Config => {
    const { enabled } = options
    if (!enabled) {
      return incomingConfig
    }

    const updatedCollections = incomingConfig.collections?.map(collection => {
      if (collection?.slug === 'pages') {
        return {
          ...collection,
          fields: collection.fields.map(field => {
            if (field.type === 'tabs') {
              return {
                ...field,
                tabs: field.tabs.map(tab => {
                  return {
                    ...tab,
                    fields: tab.fields.map(tabField => {
                      if (tabField?.type === 'blocks') {
                        return {
                          ...tabField,
                          blocks: [...tabField.blocks, DisqusCommentsConfig],
                        }
                      }
                      return tabField
                    }),
                  }
                }),
              }
            }
            return field
          }),
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
