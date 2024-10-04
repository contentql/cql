import { collectionSlug } from '../../../core/collectionSlug.js'
import { CustomCollectionConfig } from '../../../core/payload-overrides.js'
import { isAdminOrAuthor } from '../../access/isAdminOrAuthor.js'
import { slugField } from '../../fields/slug/index.js'

export const Tags: CustomCollectionConfig = {
  slug: collectionSlug.tags,
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  access: {
    read: () => true,
    update: isAdminOrAuthor,
    delete: isAdminOrAuthor,
    create: isAdminOrAuthor,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'updatedAt', 'createdAt'],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 10,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tag',
          fields: [
            {
              name: 'tagImage',
              label: 'Tag Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Upload tag image',
              },
            },
            {
              name: 'title',
              label: 'Title',
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
            {
              name: 'color',
              label: 'Tag Color',
              type: 'select',
              defaultValue: 'blue',
              options: [
                { label: 'Blue', value: 'blue' },
                { label: 'Gray', value: 'gray' },
                { label: 'Red', value: 'red' },
                { label: 'Green', value: 'green' },
                { label: 'Yellow', value: 'yellow' },
                { label: 'Indigo', value: 'indigo' },
                { label: 'Purple', value: 'purple' },
                { label: 'Pink', value: 'pink' },
              ],
            },
          ],
        },
      ],
    },
    slugField({ fieldToUse: 'title' }),
  ],
}
