import { Blogs } from '../payload/collections/Blogs/index.js'
import { Media } from '../payload/collections/Media/index.js'
import { Pages } from '../payload/collections/Pages/index.js'
import { Tags } from '../payload/collections/Tags/index.js'
import { Users } from '../payload/collections/Users/index.js'
import { siteSettings } from '../payload/globals/SiteSettings/index.js'
import type { PluginTypes as DisqusCommentsPluginTypes } from '../payload/plugins/disqus-comments/types.js'
import type { PluginTypes as ScheduleDocPublishPluginTypes } from '../payload/plugins/schedule-doc-publish-plugin/types.js'
import type { PluginTypes as MembershipPluginTypes } from '../payload/plugins/stripe-membership-plugin/types.js'
import type { SearchPluginConfig } from '@payloadcms/plugin-search/dist/types.js'
import type { SEOPluginConfig } from '@payloadcms/plugin-seo/dist/types.js'
import { type Block, type Config as PayloadConfig } from 'payload'

// added sharp as peer dependencies because nextjs-image recommends to install it
import baseConfig from './baseConfig.js'
import { CollectionSlugListType, GlobalSlugListType } from './collectionSlug.js'
import {
  CustomCollectionConfig,
  CustomGlobalConfig,
} from './payload-overrides.js'

type S3Type = {
  bucket: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  region: string
}

type ResendType = {
  defaultFromAddress: string
  defaultFromName: string
  apiKey: string
}

// Updating the collections type to CustomCollectionConfig
export interface CQLConfigType
  extends Partial<Omit<PayloadConfig, 'collections' | 'globals'>> {
  baseURL: string
  s3?: S3Type
  resend?: ResendType
  blocks?: Block[]
  schedulePluginOptions?: ScheduleDocPublishPluginTypes
  disqusCommentsOptions?: DisqusCommentsPluginTypes
  membershipPluginOptions?: MembershipPluginTypes
  collections?: CustomCollectionConfig[]
  globals?: CustomGlobalConfig[]
  dbURI?: string
  dbSecret?: string
  useVercelPostgresAdapter?: boolean
  syncDB?: boolean
  searchPluginOptions?: SearchPluginConfig | false
  seoPluginConfig?: SEOPluginConfig | undefined
  removeCollections?: CollectionSlugListType[]
  removeGlobals?: GlobalSlugListType[]
}

/**
 * Configures and builds a ContentQL configuration object.
 * This function extends the Payload CMS configuration by providing default collections
 * and you can pass all parameters that Payload config accepts.
 *
 * @example
 * // This is an example of a cql configuration
 * // By default if dbURL is not specified then the default will 'default-db'
 * // Default payload secret key is 'TESTING'
 * export default cqlConfig({
 *   dbURL: "mongodb://mydb:27017/default-db",
 *   s3: {
 *     bucket: "my-bucket",
 *     accessKeyId: "ACCESS_KEY",
 *     secretAccessKey: "SECRET_KEY",
 *     region: "us-west-2",
 *     endpoint: "https://s3.amazonaws.com"
 *   },
 *   resend: {
 *     apiKey: "RESEND_API_KEY",
 *     defaultFromAddress: "noreply@example.com",
 *     defaultFromName: "My App"
 *   }
 * // baseURL is required for Live-Preview & SEO generation
 *   baseUrl: "http://localhost:3000"
 *   removeCollections: ["blogs"]
 *   removeGlobals: ["site-settings"]
 * });
 */

const cqlConfig = (config: CQLConfigType) => {
  const blocks = config.blocks || []
  const defaultCollections = [Pages({ blocks }), Blogs, Tags, Media, Users]
  const defaultGlobals = [siteSettings]

  const buildConfig = baseConfig({
    ...config,
    defaultCollections,
    defaultGlobals,
  })

  return buildConfig
}

export default cqlConfig
