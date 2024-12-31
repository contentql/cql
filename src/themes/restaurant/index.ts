import baseConfig from '../../core/baseConfig.js'
import { CQLConfigType } from '../../core/cqlConfig.js'
import { Media } from '../../payload/collections/Media/index.js'
import { Pages } from '../../payload/collections/Pages/index.js'

import { Categories } from './collections/Categories/index.js'
import { FoodItems } from './collections/FoodItems/index.js'
import { Users } from './collections/Users/index.js'
import { siteSettings } from './globals/SiteSettings/index.js'

export const cqlConfig = (config: CQLConfigType) => {
  const blocks = config.blocks || []

  return baseConfig({
    ...config,
    defaultCollections: [
      Users,
      Pages({ blocks }),
      FoodItems,
      Categories,
      Media,
    ],
    defaultGlobals: [siteSettings],
    schedulePluginOptions: {
      enabled: true,
      collections: ['foodItems', 'categories'],
      ...config.schedulePluginOptions,
    },
    searchPluginOptions: false,
    disqusCommentsOptions: {
      enabled: false,
    },
  })
}
