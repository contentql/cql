import { ADMIN_STRIPE_GROUP } from '../constants'
import type { CollectionConfig } from 'payload'
import Stripe from 'stripe'

export const SubscriptionPlans = (stripe: Stripe): CollectionConfig => {
  return {
    slug: 'subscriptionPlans',
    admin: {
      useAsTitle: 'name',
      group: ADMIN_STRIPE_GROUP,
    },
    // hooks: {
    //   beforeChange: [handleStripeProductAndPrice(stripe)],
    // },
    // access: {
    //   create: () => false,
    //   delete: () => false,
    //   read: () => true,
    //   update: () => true,
    // },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        admin: {
          description: 'Enter the name of the subscription plan',
          // readOnly: true,
        },
      },
      {
        name: 'price',
        type: 'number',
        required: true,
        admin: {
          description: 'Enter the monthly price of the subscription plan',
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
}
