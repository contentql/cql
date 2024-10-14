import type { CollectionConfig } from 'payload'

import { ADMIN_STRIPE_GROUP } from '../constants'
import { afterDeleteCard } from './hooks/afterDeleteCard'

export const Cards: CollectionConfig = {
  slug: 'cards',
  labels: {
    singular: 'card',
    plural: 'Cards',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'paymentMethodId', 'user'],
    group: ADMIN_STRIPE_GROUP
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 10,
  },
  hooks: {
    afterDelete: [afterDeleteCard],
  },
  fields: [
    {
      name: 'name',
      label: 'Card Name',
      type: 'text',
      required: true,
    },
    {
      name: 'paymentMethodId',
      label: 'Payment Method Id',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      label: 'User',
      relationTo: ['users'],
    },
  ],
}