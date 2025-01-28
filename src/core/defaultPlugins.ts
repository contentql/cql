import { isAdmin } from '../payload/access/isAdmin.js'
import { disqusCommentsPlugin } from '../payload/plugins/disqus-comments/index.js'
import { scheduleDocPublishPlugin } from '../payload/plugins/schedule-doc-publish-plugin/index.js'
import { BeforeSyncConfig } from '../utils/beforeSync.js'
import { generateBreadcrumbsUrl } from '../utils/generateBreadcrumbsUrl.js'
import {
  generateDescription,
  generateImage,
  generateTitle,
  generateURL,
} from '../utils/seo.js'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'

import { collectionSlug } from './collectionSlug.js'
import { CQLConfigType } from './cqlConfig.js'

export const defaultPlugins = ({
  theme = 'blog',
  baseURL,
  schedulePluginOptions,
  disqusCommentsOptions = {
    enabled: true,
  },
  seoPluginConfig,
  searchPluginOptions,
  plugins = [],
  s3,
}: CQLConfigType) => {
  const defaultPlugins = [...plugins]

  // Adding S3 plugin if configuration is defined
  if (s3) {
    const { bucket, collections, config, ...options } = s3
    defaultPlugins.push(
      s3Storage({
        ...options,
        collections: {
          ['media']: true,
          ...collections,
        },
        bucket,
        config: {
          ...config,
          requestChecksumCalculation: 'WHEN_REQUIRED',
          responseChecksumValidation: 'WHEN_REQUIRED',
        },
      }),
    )
  }

  switch (theme) {
    case 'blog':
      return [
        ...defaultPlugins,
        scheduleDocPublishPlugin({
          enabled: true,
          collections: [collectionSlug['blogs']],
          position: 'sidebar',
          ...(schedulePluginOptions ? schedulePluginOptions : {}),
        }),
        nestedDocsPlugin({
          collections: [collectionSlug['pages']],
          generateURL: generateBreadcrumbsUrl,
        }),
        disqusCommentsPlugin(disqusCommentsOptions),
        seoPlugin({
          collections: [
            collectionSlug['pages'],
            collectionSlug['blogs'],
            collectionSlug['tags'],
            ...(seoPluginConfig?.collections ?? []),
          ],
          uploadsCollection: 'media',
          tabbedUI: true,
          generateURL: data => generateURL({ data, baseURL }),
          generateTitle,
          generateDescription,
          generateImage,
          ...(seoPluginConfig ? seoPluginConfig : {}),
        }),
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
    case 'restaurant':
      return [
        scheduleDocPublishPlugin({
          enabled: true,
          collections: ['foodItems', 'categories'],
          position: 'sidebar',
          ...(schedulePluginOptions ? schedulePluginOptions : {}),
        }),
      ]
    default:
      return []
  }
}
