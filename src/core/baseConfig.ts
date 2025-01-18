import { isAdmin } from '../payload/access/isAdmin.js'
import { DisqusCommentsPlugin } from '../payload/plugins/disqus-comments/index.js'
import { scheduleDocPublishPlugin } from '../payload/plugins/schedule-doc-publish-plugin/index.js'
import { stripeV3 } from '../payload/plugins/stripe-membership-plugin/plugin.js'
import { BeforeSyncConfig } from '../utils/beforeSync.js'
import { deepMerge } from '../utils/deepMerge.js'
import { generateBreadcrumbsUrl } from '../utils/generateBreadcrumbsUrl.js'
import {
  generateDescription,
  generateImage,
  generateTitle,
  generateURL,
} from '../utils/seo.js'
import { resendAdapter } from '@payloadcms/email-resend'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { slateEditor } from '@payloadcms/richtext-slate'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

// added sharp as peer dependencies because nextjs-image recommends to install it
import {
  CollectionSlugListType,
  GlobalSlugListType,
  collectionSlug,
} from './collectionSlug.js'
import { CQLConfigType } from './cqlConfig.js'
import { db } from './databaseAdapter.js'
import {
  CustomCollectionConfig,
  CustomGlobalConfig,
} from './payload-overrides.js'

interface BaseConfigType extends CQLConfigType {
  defaultCollections: CustomCollectionConfig[]
  defaultGlobals: CustomGlobalConfig[]
}

const getWhitelistDomains = (domains: string[]) => {
  const railwayDomain = '.up.railway.app'
  const contentqlDomain = '.contentql.io'

  return domains
    .map(domain => {
      let clonedDomain = domain

      if (clonedDomain.includes(railwayDomain)) {
        return [domain, clonedDomain.replace(railwayDomain, contentqlDomain)]
      }

      return [domain]
    })
    .flat()
}

export default function baseConfig({
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
  disqusCommentsOptions = {
    enabled: true,
  },
  schedulePluginOptions = {
    enabled: true,
    collections: [collectionSlug['blogs']],
    position: 'sidebar',
  },
  searchPluginOptions = {},
  email,
  membershipPluginOptions,
  dbURI,
  dbSecret,
  db: userDB,
  useVercelPostgresAdapter = false,
  syncDB,
  syncInterval,
  seoPluginConfig,
  removeCollections = [],
  removeGlobals = [],
  defaultCollections,
  defaultGlobals,
  prodMigrations,
  ...config
}: BaseConfigType) {
  const plugins: CQLConfigType['plugins'] = config.plugins || []
  const collectionsList = defaultCollections
  const globalsList = defaultGlobals

  // Collections specified in pickCollections will be selected other collections are ignored
  // Not removing the users collection that should be can only be extended but can't be removed
  const filteredCollections = removeCollections.length
    ? collectionsList.filter(
        collection =>
          !removeCollections.includes(
            collection.slug as CollectionSlugListType,
          ) || collection.slug === 'users',
      )
    : collectionsList

  // Collections specified in pickCollections will be selected other collections are ignored
  const filteredGlobals = removeGlobals.length
    ? globalsList.filter(
        collection =>
          !removeGlobals.includes(collection.slug as GlobalSlugListType),
      )
    : globalsList

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
          requestChecksumCalculation: 'WHEN_REQUIRED',
          responseChecksumValidation: 'WHEN_REQUIRED',
        },
      }),
    )
  }

  if (collections.length) {
    // mapping through user collections
    collections.forEach(collection => {
      // checking if the user collection overlaps with default collection
      const index = filteredCollections.findIndex(
        collectionValue => collectionValue.slug === collection.slug,
      )

      // if collection overlaps with default collection then doing deepMerge
      if (index !== -1) {
        filteredCollections[index] = deepMerge(
          filteredCollections[index],
          collection,
        )
      }
      // else pushing the user collection to default collection
      else {
        filteredCollections.push(collection)
      }
    })
  }

  if (globals.length) {
    globals.forEach(globalCollection => {
      // checking if the user globals overlaps with default globals
      const index = filteredGlobals.findIndex(
        collectionValue => collectionValue.slug === globalCollection.slug,
      )

      // if globals overlaps with default globals then doing deepMerge
      if (index !== -1) {
        filteredGlobals[index] = deepMerge(
          filteredGlobals[index],
          globalCollection,
        )
      }
      // else pushing the user globals to default globals
      else {
        filteredGlobals.push(globalCollection)
      }
    })
  }

  return buildConfig({
    ...config,
    admin: {
      ...admin,
      user: collectionSlug['users'],
      meta: {
        titleSuffix: '- ContentQL',
        ...(admin.meta || {}),
      },
    },
    collections: [...filteredCollections],
    globals: filteredGlobals,
    db:
      userDB ||
      db({
        databaseURI: dbURI,
        databaseSecret: dbSecret,
        useVercelPostgresAdapter,
        syncDB,
        syncInterval,
        prodMigrations,
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
      // disqus comments plugin
      DisqusCommentsPlugin(disqusCommentsOptions),
      // this plugin generates metadata field for every page created
      seoPlugin({
        ...(seoPluginConfig ? seoPluginConfig : {}),
        collections: [
          collectionSlug['pages'],
          collectionSlug['blogs'],
          collectionSlug['tags'],
          collectionSlug['categories'],
          ...(seoPluginConfig?.collections ?? []),
        ],
        uploadsCollection: 'media',
        tabbedUI: true,
        generateURL: data => generateURL({ data, baseURL }),
        generateTitle,
        generateDescription,
        generateImage,
      }),
      formBuilderPlugin({
        fields: {
          payment: false,
          state: false,
        },
      }),
      // this plugin is for global search across the defined collections
      ...(searchPluginOptions !== false
        ? [
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
          ]
        : []),
      stripeV3(membershipPluginOptions),
    ],
    cors: Array.isArray(cors) ? getWhitelistDomains(cors) : cors,
    csrf: csrf ? getWhitelistDomains(csrf) : csrf,
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
