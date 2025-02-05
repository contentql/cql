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
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { Field } from 'payload'

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
  formBuilderPluginOptions,
}: CQLConfigType) => {
  const defaultPlugins = [...plugins]

  const formPlugin = formBuilderPlugin({
    ...formBuilderPluginOptions,
    fields: {
      payment: false,
      state: false,
      ...(formBuilderPluginOptions?.fields || {}),
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map(field => {
          if (field.type === 'blocks' && field.name === 'fields') {
            return {
              ...field,
              blocks: [
                ...field.blocks,
                {
                  slug: 'upload',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                          label: 'Name (lowercase, no special characters)',
                          required: true,
                          admin: {
                            width: '50%',
                          },
                        },
                        {
                          name: 'label',
                          type: 'text',
                          label: 'Label',
                          localized: true,
                          admin: {
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'size',
                          label: 'Size',
                          type: 'number',
                          required: true,
                          defaultValue: 5,
                          admin: {
                            description:
                              'Enter the maximum size of each file in MB',
                            width: '50%',
                          },
                        },
                        {
                          name: 'width',
                          type: 'number',
                          label: 'Field Width (percentage)',
                          admin: {
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'multiple',
                          label: 'Multiple Attachments',
                          type: 'checkbox',
                          required: true,
                          defaultValue: false,
                          admin: {
                            description:
                              'Check this box if you want to allow multiple attachments',
                          },
                        },
                        {
                          name: 'required',
                          type: 'checkbox',
                          label: 'Required',
                        },
                      ],
                    },
                  ],
                },
                ...(formBuilderPluginOptions?.formOverrides?.blocks || []),
              ],
            }
          }

          return field
        })
      },
      ...(formBuilderPluginOptions?.formOverrides || {}),
    },
    formSubmissionOverrides: {
      fields: ({ defaultFields }) => {
        const updatedDefaultFields: Field[] = defaultFields.map(field => {
          if (field.type === 'array' && field.name === 'submissionData') {
            return {
              ...field,
              fields: [
                ...field.fields,
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                },
              ],
            }
          }
          return field
        })

        return [
          ...updatedDefaultFields,
          ...(formBuilderPluginOptions?.formSubmissionOverrides?.extraFields ||
            []),
        ]
      },
      ...(formBuilderPluginOptions?.formSubmissionOverrides || {}),
    },
  })

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

  // If searchPluginOptions is not false adding the plugin
  if (searchPluginOptions !== false && theme === 'blog') {
    defaultPlugins.push(
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
    )
  }

  switch (theme) {
    case 'blog':
      return [
        ...defaultPlugins,
        formPlugin,
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
      ]
    case 'restaurant':
      return [
        formPlugin,
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
