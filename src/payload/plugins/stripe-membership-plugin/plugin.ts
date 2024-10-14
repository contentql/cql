import type { Config, Plugin } from 'payload'
import { CollectionBeforeChangeHook } from 'payload'
import Stripe from 'stripe'

import { Cards } from './collections/Cards'
import { Orders } from './collections/Orders'
import { SubscriptionPlans } from './collections/SubscriptionPlans'
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
    const stripeSdk = new Stripe(PluginOptions.secretKey)

    const stripeWebhookSecret = PluginOptions.webhookSecretKey

    // @ts-ignore
    const updatedCollection = incomingConfig.collections.map(collection => {
      if (collection.slug === 'users') {
        return {
          ...collection,
          hooks: {
            ...collection.hooks,
            beforeChange: [
              ...(collection.hooks?.beforeChange || []),
              createCustomer(stripeSdk),
              createWalletCreditInStripe(stripeSdk),
            ],
          },
          fields: [
            ...JSON.parse(JSON.stringify(collection.fields)),
            {
              name: 'stripe_customer_code',
              type: 'text',
              label: 'Stripe Customer Code',
              admin: {
                readOnly: true,
              },
            },
            {
              label: 'User Plan',
              name: 'user_plan',
              type: 'select',
              hasMany: false,
              defaultValue: 'free',
              options: [
                {
                  label: 'Free Plan',
                  value: 'free',
                },
                {
                  label: 'Pro',
                  value: 'pro',
                },
                {
                  label: 'Enterprise',
                  value: 'enterprise',
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
            {
              name: 'wallet',
              label: 'Wallet',
              type: 'number',
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
        // {
        //   path: '/v1/stripe/webhook',
        //   method: 'post',
        //   handler: async req => {
        //     const data = await stripeWebhook(
        //       //@ts-ignore
        //       req,
        //       stripeSdk,
        //       stripeWebhookSecret,
        //     )
        //     return Response.json(data)
        //   },
        // },
      ],
      collections: [...updatedCollection, Orders, Cards, SubscriptionPlans],
    }
    return config
  }
