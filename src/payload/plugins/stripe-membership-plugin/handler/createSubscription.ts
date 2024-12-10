// import Stripe from 'stripe'
// export const createSubscription = async (stripeSdk: Stripe) => {
//   try {
//     // Calculate the application fee amount as a percentage of the price
//     const price = await stripeSdk.prices.retrieve(
//       'price_1QSt1CP2ZUGTn5p0Fbxcup0l',
//     )
//     const unitAmount = price.unit_amount ?? 0
//     // Create the subscription on behalf of the seller
//     const subscription = await stripeSdk.subscriptions.create(
//       {
//         customer: 'cus_RIaxmBb6oNOUGV',
//         items: [
//           {
//             price: 'price_1QSt1CP2ZUGTn5p0Fbxcup0l',
//           },
//         ],
//         expand: ['latest_invoice.payment_intent'],
//         application_fee_percent: 0.5 * 100,
//         transfer_data: {
//           destination: 'acct_1QSsxt1hVxOXgcCL',
//         },
//       },
//       {
//         stripeAccount: 'acct_1QSky2P3xbRF2JJP', // Seller's account
//       },
//     )
//     const invoice = await stripeSdk.invoices.create({
//       customer: 'cus_RIaxmBb6oNOUGV',
//       collection_method: 'send_invoice',
//       auto_advance: false, // Automatically attempt to pay the invoice
//       subscription: subscription.id,
//       //   days_until_due: 30,
//     })
//     return {
//       success: true,
//       subscription,
//       invoice,
//     }
//   } catch (error) {
//     console.error('Error creating subscription:', error)
//     return {
//       success: false,
//       error: error,
//     }
//   }
// }
import Stripe from 'stripe'

export const createSubscription = async (stripeSdk: Stripe) => {
  try {
    const session = await stripeSdk.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: 'price_1QUQN4P2ZUGTn5p0iN51DjNM', // Your price ID
          quantity: 1,
        },
      ],
      customer: 'cus_RNAkZcSWCe1RQL', // Optional: existing customer
      payment_intent_data: {
        transfer_group: 'ORDER100',
      },
      success_url: 'http://localhost:3000/',
      cancel_url: 'http://localhost:3000', //Required cancel and success pages
      // Optional: additional configuration
      payment_method_types: ['card'], // Limit payment methods if needed
    })

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
