import { ADMIN_STRIPE_GROUP } from '../constants'
import type { CollectionConfig } from 'payload'
import Stripe from 'stripe'

import { afterDeleteCard } from './hooks/afterDeleteCard'

export const Cards = (stripe: Stripe): CollectionConfig => {
  return {
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
      group: ADMIN_STRIPE_GROUP,
    },
    versions: {
      drafts: {
        autosave: false,
      },
      maxPerDoc: 10,
    },
    hooks: {
      afterDelete: [afterDeleteCard(stripe)],
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
}
