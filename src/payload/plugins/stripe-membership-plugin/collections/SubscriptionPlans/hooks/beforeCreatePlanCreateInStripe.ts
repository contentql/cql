import { CollectionBeforeChangeHook } from 'payload'

export const handleStripeProductAndPrice =
  (stripeSdk: any): CollectionBeforeChangeHook =>
  async ({ operation, data, originalDoc, req }) => {
    const { user } = req

    //create product in stripe
    if (operation === 'create') {
      const product = await stripeSdk.products.create(
        {
          name: data.name,
          metadata: {
            seller_id: user?.id,
            seller_stripe_account: user?.stripe_user_id,
          },
        },
        // {
        //   stripeAccount: 'acct_1QUBu3P7riMLNotV', // Ensure context of connected account
        // },
      )
      const price = await stripeSdk.prices.create(
        {
          product: product.id,
          unit_amount: data.price * 100,
          currency: 'usd',
          recurring: { interval: 'month' },
          metadata: {
            seller_id: user?.id,
            seller_stripe_account: user?.stripe_user_id,
          },
        },
        // {
        //   stripeAccount: 'acct_1QUBu3P7riMLNotV', // Ensure context of connected account
        // },
      )
      data.stripeProductId = product.id
      data.stripePriceId = price.id

      //update product in stripe
    } else if (operation === 'update') {
      // Check if name has changed
      if (data.name !== originalDoc.name) {
        await stripeSdk.products.update(
          data.stripeProductId,
          {
            name: data.name,
          },
          // {
          //   stripeAccount: 'acct_1QUBu3P7riMLNotV', // Ensure context of connected account
          // },
        )
      }

      // Check if price has changed
      if (data.price !== originalDoc.price) {
        const newPrice = await stripeSdk.prices.create(
          {
            product: data.stripeProductId,
            unit_amount: data.price * 100,
            currency: 'usd',
            recurring: { interval: 'month' },
            metadata: {
              seller_id: user?.id,
              seller_stripe_account: user?.stripe_user_id,
            },
          },
          // {
          //   stripeAccount: 'acct_1QUBu3P7riMLNotV', // Ensure context of connected account
          // },
        )
        data.stripePriceId = newPrice.id
      }
    }
    return data
  }
