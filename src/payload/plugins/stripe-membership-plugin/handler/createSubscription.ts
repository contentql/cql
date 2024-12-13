import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const createSubscription = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  publicURI: string,
) => {
  const body = await request.json!()
  const { user } = request
  console.log({ user })
  const { userId, product } = body

  if (!userId) {
    return ''
  }

  try {
    const user = await request.payload.findByID({
      collection: 'users',
      id: userId,
    })

    const stripeConnectedAccounts = await request.payload.find({
      collection: 'users', // Replace with your actual users collection slug
      where: {
        and: [
          { role: { equals: 'admin' } }, // Match role as 'admin'
          { stripe_user_id: { exists: true } }, // Ensure stripe_user_id exists
        ],
      },
    })

    const session = await stripeSdk.checkout.sessions.create({
      mode: 'subscription',
      // For subscriptions only(Currently not working for indian customers)
      subscription_data: {
        application_fee_percent: Math.round(0.04 * 100),
        transfer_data: {
          destination: stripeConnectedAccounts.docs[0].stripe_user_id,
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      invoice_creation: { enabled: true },
      customer: user.stripe_customer_code, // Optional: existing customer
      success_url: publicURI,
      cancel_url: publicURI, //Required cancel and success pages
      // Optional: additional configuration
      payment_method_types: ['card'], // Limit payment methods if needed
    })

    // const transfer = await stripeSdk.transfers.create({
    //   amount: 20,
    //   currency: 'usd',
    //   destination: 'acct_1QUSyPSF1karazjW',
    //   transfer_group: 'ORDER600',
    // })

    // return {
    //   success: true,
    //   transferId: transfer.id,
    //   transferAmount: transfer.amount,
    // }

    return {
      success: true,
      sessionId: session.id,
      sessionUrl: session.url, // Checkout page URL
    }
  } catch (error) {
    console.error('Subscription Session Creation Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
