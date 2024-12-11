import { isAdmin } from '../../../../access/isAdmin'
import { ADMIN_STRIPE_GROUP } from '../constants'
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: ADMIN_STRIPE_GROUP,
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Enter the name of the product',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Enter the price for the product',
      },
    },
    {
      name: 'description',
      label: 'Plan Description',
      type: 'text',
      admin: {
        description: 'Enter plan description',
      },
    },
    {
      name: 'features',
      label: 'Plan Features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          label: 'Feature',
          type: 'text',
        },
      ],
    },
  ],
}
