//@ts-nocheck
import type { Config, Plugin } from 'payload'
import { CollectionBeforeChangeHook } from 'payload'
import Stripe from 'stripe'

import { Cards } from './collections/Cards'
import { Orders } from './collections/Orders'
import { SubscriptionPlans } from './collections/SubscriptionPlans'
import { stripeWebhook } from './handler/stripeWebhook'
import { PluginTypes } from './types'

const createCustomer =
  (stripeSdk: Stripe): CollectionBeforeChangeHook =>
  async ({ operation, data }) => {
    if (operation === 'create') {
      try {
        const customer = await stripeSdk.customers.create({ email: data.email })
        data.stripe_customer_code = customer.id
      } catch (error) {
        console.error('Error creating customer:', error)
      }
    }
    return data
  }

const createWalletCreditInStripe =
  (stripeSdk: Stripe): CollectionBeforeChangeHook =>
  async ({ operation, data, originalDoc, req }) => {
    if (operation === 'update') {
      const newAmount = data.wallet
      const oldAmount = originalDoc.wallet
      const user = req.user

      console.log({ req })
      console.log({ user })

      if (newAmount !== oldAmount && user?.role?.includes('admin')) {
        try {
          const customer = await stripeSdk.customers.createBalanceTransaction(
            data.stripe_customer_code,
            {
              amount: -data.wallet * 100,
              currency: 'usd',
            },
          )
        } catch (error) {
          console.error('Error creating customer credit:', error)
        }
      }
    }
  }

export const stripeV3 =
  (PluginOptions: PluginTypes): Plugin =>
  (incomingConfig: Config): Config => {
    // if secret is not given returning the incoming config
    if (!PluginOptions) {
      return incomingConfig
    }

    const stripeSdk = new Stripe(PluginOptions.secretKey)
    const stripeWebhookSecret = PluginOptions.webhookSecretKey
    const stripeOauthClientId = PluginOptions.clientId

    const collections = incomingConfig.collections || []

    const updatedCollection = collections.map(collection => {
      if (collection.slug === 'users') {
        return {
          ...collection,
          hooks: {
            ...collection.hooks,
            beforeChange: [
              ...(collection.hooks?.beforeChange || []),
              createCustomer(stripeSdk),
            ],
          },
          fields: [
            // ...JSON.parse(JSON.stringify(collection.fields)),
            ...collection.fields,
            {
              name: 'stripe_customer_code',
              type: 'text',
              label: 'Stripe Customer Code',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'stripe_user_id',
              type: 'text',
              label: 'Stripe user id',
            },
            {
              label: 'User Plan',
              name: 'user_plan',
              type: 'select',
              hasMany: false,
              defaultValue: 'free',
              options: [
                {
                  label: 'Free',
                  value: 'free',
                },
                {
                  label: 'Premium',
                  value: 'premium',
                },
              ],
            },
            {
              name: 'stripe_subscription_id',
              label: 'Stripe Subscription ID',
              type: 'text',
              // admin: {
              //   readOnly: true,
              // },
            },
            {
              name: 'last_billed_date',
              label: 'Last Billed Date',
              type: 'date',
            },
            {
              name: 'plan_end_date',
              label: 'Plan end date',
              type: 'date',
            },
            {
              name: 'subscription_status',
              label: 'Subscription Status',
              type: 'text',
            },
          ],
        }
      }

      return collection
    })

    const config: Config = {
      ...incomingConfig,

      endpoints: [
        ...incomingConfig.endpoints!,
        {
          path: '/v1/stripe/webhook',
          method: 'post',
          handler: async req => {
            const data = await stripeWebhook(
              req,
              stripeSdk,
              stripeWebhookSecret,
            )

            return Response.json(data)
          },
        },
      ],
      collections: [
        ...updatedCollection,
        Orders,
        Cards(stripeSdk),
        SubscriptionPlans(stripeSdk),
      ],
    }
    return config
  }
