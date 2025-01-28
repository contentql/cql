import type { PluginTypes as DisqusCommentsPluginTypes } from '../payload/plugins/disqus-comments/types.js'
import type { PluginTypes as ScheduleDocPublishPluginTypes } from '../payload/plugins/schedule-doc-publish-plugin/types.js'
import type { PluginTypes as MembershipPluginTypes } from '../payload/plugins/stripe-membership-plugin/types.js'
import type { SearchPluginConfig } from '@payloadcms/plugin-search/types'
import type { SEOPluginConfig } from '@payloadcms/plugin-seo/types'
import { S3StorageOptions } from '@payloadcms/storage-s3'
import {
  CollectionConfig,
  GlobalConfig,
  type Config as PayloadConfig,
} from 'payload'

import baseConfig from './baseConfig.js'
import { CustomFormBuilderPluginConfig } from './payload-overrides.js'
import { ResendType, ThemeType } from './types.js'

export interface CQLConfigType
  extends Partial<Omit<PayloadConfig, 'collections' | 'globals'>> {
  theme?: ThemeType
  baseURL: string
  s3?: S3StorageOptions
  resend?: ResendType
  schedulePluginOptions?: ScheduleDocPublishPluginTypes
  disqusCommentsOptions?: DisqusCommentsPluginTypes
  membershipPluginOptions?: MembershipPluginTypes
  collections?: CollectionConfig[]
  globals?: GlobalConfig[]
  dbURI?: string
  dbSecret?: string
  useVercelPostgresAdapter?: boolean
  syncDB?: boolean
  syncInterval?: number
  searchPluginOptions?: SearchPluginConfig | false
  seoPluginConfig?: SEOPluginConfig | undefined
  formBuilderPluginOptions?: CustomFormBuilderPluginConfig
  prodMigrations?: {
    down: (args: any) => Promise<void>
    name: string
    up: (args: any) => Promise<void>
  }[]
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
 * });
 */

const cqlConfig = (config: CQLConfigType) => {
  return baseConfig(config)
}

export default cqlConfig
