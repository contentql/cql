import { isAdmin } from '../payload/access/isAdmin.js'
import { Blogs } from '../payload/collections/Blogs/index.js'
import { Media } from '../payload/collections/Media/index.js'
import { Pages } from '../payload/collections/Pages/index.js'
import { Tags } from '../payload/collections/Tags/index.js'
import { Users } from '../payload/collections/Users/index.js'
import { siteSettings } from '../payload/globals/SiteSettings/index.js'
import { scheduleDocPublishPlugin } from '../payload/plugins/schedule-doc-publish-plugin/index.js'
import type { PluginTypes as ScheduleDocPublishPluginTypes } from '../payload/plugins/schedule-doc-publish-plugin/types.js'
import { BeforeSyncConfig } from '../utils/beforeSync.js'
import { deepMerge } from '../utils/deepMerge.js'
import { generateBreadcrumbsUrl } from '../utils/generateBreadcrumbsUrl.js'
import {
  generateDescription,
  generateImage,
  generateTitle,
  generateURL,
} from '../utils/seo.js'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { searchPlugin } from '@payloadcms/plugin-search'
import type { SearchPluginConfig } from '@payloadcms/plugin-search/dist/types.js'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { slateEditor } from '@payloadcms/richtext-slate'
import { s3Storage } from '@payloadcms/storage-s3'
import { type Block, type Config as PayloadConfig, buildConfig } from 'payload'
// added sharp as peer dependencies because nextjs-image recommends to install it
import sharp from 'sharp'

import { collectionSlug } from './collectionSlug.js'
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
  dbURL: string
  baseURL: string
  s3?: S3Type
  resend?: ResendType
  blocks?: Block[]
  schedulePluginOptions?: ScheduleDocPublishPluginTypes
  searchPluginOptions?: SearchPluginConfig
  collections?: CustomCollectionConfig[]
  globals?: CustomGlobalConfig[]
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

const cqlConfig = ({
  dbURL = 'mongodb://localhost:27017/default-db',
  baseURL = 'http://localhost:3000',
  cors = ['http://localhost:3000'],
  csrf = ['http://localhost:3000'],
  s3,
  admin = {},
  secret = 'TESTING',
  editor = slateEditor({}),
  collections = [],
  globals = [],
  resend,
  blocks,
  schedulePluginOptions = {
    enabled: true,
    collections: [collectionSlug['blogs']],
    position: 'sidebar',
  },
  searchPluginOptions = {},
  email,
  ...config
}: CQLConfigType) => {
  const plugins: CQLConfigType['plugins'] = config.plugins || []

  if (s3) {
    const { bucket, accessKeyId, endpoint, region, secretAccessKey } = s3

    plugins.push(
      s3Storage({
        collections: {
          ['media']: true,
        },
        bucket,
        config: {
          endpoint,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          region,
        },
      }),
    )
  }

  const defaultCollections = [Users, Tags, Blogs, Media, Pages({ blocks })]

  if (collections.length) {
    // mapping through user collections
    collections.forEach(collection => {
      // checking if the user collection overlaps with default collection
      const index = defaultCollections.findIndex(
        collectionValue => collectionValue.slug === collection.slug,
      )

      // if collection overlaps with default collection then doing deepMerge
      if (index !== -1) {
        defaultCollections[index] = deepMerge(
          defaultCollections[index],
          collection,
        )
      }
      // else pushing the user collection to default collection
      else {
        defaultCollections.push(collection)
      }
    })
  }

  const defaultGlobals = [siteSettings]

  if (globals.length) {
    globals.forEach(globalCollection => {
      // checking if the user globals overlaps with default globals
      const index = defaultGlobals.findIndex(
        collectionValue => collectionValue.slug === globalCollection.slug,
      )

      // if globals overlaps with default globals then doing deepMerge
      if (index !== -1) {
        defaultGlobals[index] = deepMerge(
          defaultGlobals[index],
          globalCollection,
        )
      }
      // else pushing the user globals to default globals
      else {
        defaultGlobals.push(globalCollection)
      }
    })
  }

  return buildConfig({
    ...config,
    admin: {
      ...admin,
      user: Users.slug,
      meta: {
        titleSuffix: '- ContentQL',
        ...(admin.meta || {}),
      },
      livePreview: {
        url: ({ data, collectionConfig, locale }) => {
          return `${baseURL}/${data.path}${
            locale ? `?locale=${locale.code}` : ''
          }`
        },

        collections: [collectionSlug['blogs'], collectionSlug['pages']],

        breakpoints: [
          {
            label: 'Mobile',
            name: 'mobile',
            width: 375,
            height: 667,
          },
          {
            label: 'Tablet',
            name: 'tablet',
            width: 768,
            height: 1024,
          },
          {
            label: 'Desktop',
            name: 'desktop',
            width: 1440,
            height: 900,
          },
        ],

        ...(admin.livePreview || {}),
      },
    },
    collections: defaultCollections,
    globals: defaultGlobals,
    db: mongooseAdapter({
      url: dbURL,
    }),
    secret,
    plugins: [
      ...plugins,
      nestedDocsPlugin({
        collections: [collectionSlug['pages']],
        generateURL: generateBreadcrumbsUrl,
      }),
      // this is for scheduling document publish
      scheduleDocPublishPlugin(schedulePluginOptions),
      // this plugin generates metadata field for every page created
      seoPlugin({
        collections: [collectionSlug['pages']],
        uploadsCollection: 'media',
        tabbedUI: true,
        generateURL: data => generateURL({ data, baseURL }),
        generateTitle,
        generateDescription,
        generateImage,
      }),
      // this plugin is for global search across the defined collections
      searchPlugin({
        collections: [
          collectionSlug['blogs'],
          collectionSlug['tags'],
          collectionSlug['users'],
        ],
        defaultPriorities: {
          [collectionSlug['blogs']]: 10,
          [collectionSlug['tags']]: 20,
          [collectionSlug['users']]: 30,
        },
        beforeSync: BeforeSyncConfig,
        searchOverrides: {
          access: {
            read: isAdmin,
          },
        },
        ...searchPluginOptions,
      }),
    ],
    cors,
    csrf,
    editor,
    sharp,
    email: resend
      ? resendAdapter({
          apiKey: resend.apiKey,
          defaultFromAddress: resend.defaultFromAddress,
          defaultFromName: resend.defaultFromName,
        })
      : email,
  })
}

export default cqlConfig
