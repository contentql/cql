import { collectionSlug } from '../../../../core/collectionSlug.js'
import { isAdmin } from '../../../../payload/access/isAdmin.js'
import { CONTENT_GROUP } from '../../../../payload/collections/constants.js'
import { slugField } from '../../../../payload/fields/slug/index.js'
import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: collectionSlug.categories,
  access: {
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
    create: isAdmin,
  },
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'name',
    group: CONTENT_GROUP,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Category',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload tag image',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              unique: true,
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    slugField({
      fieldToUse: 'name',
      overrides: {
        required: true,
      },
    }),
  ],
}
