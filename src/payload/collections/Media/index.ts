import { collectionSlug } from '../../../core/collectionSlug.js'
import {
  CustomCollectionConfig,
  CustomField,
} from '../../../core/payload-overrides.js'
import { isAdminOrAuthor } from '../../access/isAdminOrAuthor.js'
import { UPLOADS_GROUP } from '../constants.js'

const urlField: CustomField = {
  name: 'url',
  type: 'text',
}

export const Media: CustomCollectionConfig = {
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
        height: 300,
        position: 'centre',
      },
      {
        name: 'blogImageSize2',
        width: 986,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'blogImageSize3',
        width: 1470,
        height: undefined,
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
