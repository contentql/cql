import { collectionSlug } from '../../../core/collectionSlug.js'
import { isAdminOrAuthor } from '../../access/isAdminOrAuthor.js'
import { UPLOADS_GROUP } from '../constants.js'
import { CollectionConfig, Field } from 'payload'

const urlField: Field = {
  name: 'url',
  type: 'text',
}

export const Media: CollectionConfig = {
  slug: collectionSlug.media,
  access: {
    read: () => true,
    update: isAdminOrAuthor,
    delete: isAdminOrAuthor,
    create: () => true,
  },
  admin: {
    group: UPLOADS_GROUP,
  },
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        position: 'centre',
      },
      {
        name: 'blogImageSize2',
        width: 986,
        position: 'centre',
      },
      {
        name: 'blogImageSize3',
        width: 1470,
        position: 'centre',
      },
    ],
    focalPoint: true,
    crop: true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
    },
    // The following fields should be able to be merged in to default upload fields
    urlField,
    {
      name: 'sizes',
      type: 'group',
      fields: [
        {
          name: 'square',
          type: 'group',
          fields: [urlField],
        },
      ],
    },
  ],
}
