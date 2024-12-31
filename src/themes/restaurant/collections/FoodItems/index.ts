import { collectionSlug } from '../../../../core/collectionSlug.js'
import { CustomCollectionConfig } from '../../../../core/payload-overrides.js'
import { isAdmin } from '../../../../payload/access/isAdmin.js'
import { CONTENT_GROUP } from '../../../../payload/collections/constants.js'

export const FoodItems: CustomCollectionConfig = {
  slug: 'foodItems',
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
    { type: 'text', name: 'name', required: true },
    { type: 'textarea', name: 'description' },
    {
      type: 'select',
      name: 'type',
      options: [
        {
          label: 'Veg',
          value: 'veg',
        },
        {
          label: 'Non Veg',
          value: 'nonVeg',
        },
      ],
      required: true,
    },
    {
      type: 'relationship',
      name: 'categories',
      relationTo: collectionSlug.categories,
      hasMany: true,
    },
    {
      type: 'number',
      name: 'price',
      required: true,
    },
    {
      type: 'checkbox',
      name: 'special',
      required: true,
      defaultValue: false,
      admin: {
        description:
          'Check to mark food-item as special, food-item will be shown with special badge',
      },
    },
    {
      type: 'upload',
      name: 'gallery',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}
