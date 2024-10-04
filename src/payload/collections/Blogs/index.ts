import { collectionSlug } from '../../../core/collectionSlug.js'
import { CustomCollectionConfig } from '../../../core/payload-overrides.js'
import { isAdminOrAuthor } from '../../access/isAdminOrAuthor.js'
import { slugField } from '../../fields/slug/index.js'
import { CONTENT_GROUP } from '../constants.js'

import { isAdminOrSelf } from './access/isAdminOrSelf.js'
import { assignUserId } from './field-level-hooks/assignUserId.js'

export const Blogs: CustomCollectionConfig = {
  slug: collectionSlug.blogs,
  labels: {
    singular: 'Blog',
    plural: 'Blogs',
  },
  access: {
    read: () => true,
    create: isAdminOrAuthor,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  admin: {
    useAsTitle: 'title',
    group: CONTENT_GROUP,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Blog',
          fields: [
            {
              name: 'blogImage',
              label: 'Blog Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Upload blog image',
              },
            },
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Add the summary of the blog post',
              },
            },
            {
              name: 'tags',
              label: 'Tags',
              type: 'relationship',
              relationTo: ['tags'],
              hasMany: true,
            },
            {
              name: 'author',
              type: 'relationship',
              label: 'Author',
              relationTo: ['users'],
              hasMany: true,
              hooks: {
                beforeChange: [assignUserId],
              },
              filterOptions: ({ relationTo, data }) => {
                if (relationTo === 'users') {
                  return {
                    role: {
                      in: ['author'],
                    },
                  }
                } else {
                  return false
                }
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Content',
              required: true,
              admin: {
                description:
                  'Main content of the blog post. Use the rich text editor for formatting.',
              },
            },
          ],
        },
      ],
    },
    slugField({ fieldToUse: 'title' }),
  ],
}
