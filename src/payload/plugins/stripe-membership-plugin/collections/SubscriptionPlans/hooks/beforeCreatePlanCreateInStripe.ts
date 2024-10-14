import { CollectionBeforeChangeHook } from 'payload'
import Stripe from 'stripe'

//! Get stripe token
const stripeSdk = new Stripe('STRIPE_SECRET_KEY')

export const handleStripeProductAndPrice: CollectionBeforeChangeHook = async ({
  operation,
  data,
  originalDoc,
}) => {
  if (operation === 'create') {
    const product = await stripeSdk.products.create({
      name: data.name,
    })
    const price = await stripeSdk.prices.create({
      product: product.id,
      unit_amount: data.price * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
    })

    const paymentLink = await stripeSdk.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    })

    data.stripeProductId = product.id
    data.stripePriceId = price.id
    data.stripePaymentLink = paymentLink.url
  } else if (operation === 'update') {
    // Check if name has changed
    if (data.name !== originalDoc.name) {
      await stripeSdk.products.update(data.stripeProductId, {
        name: data.name,
      })
    }

    // Check if price has changed
    if (data.price !== originalDoc.price) {
      const newPrice = await stripeSdk.prices.create({
        product: data.stripeProductId,
        unit_amount: data.price * 100,
        currency: 'usd',
        recurring: { interval: 'month' },
      })

      // Generate new payment link with the updated price
      const newPaymentLink = await stripeSdk.paymentLinks.create({
        line_items: [{ price: newPrice.id, quantity: 1 }],
      })

      // Update data with the new price ID and payment link
      data.stripePriceId = newPrice.id
      data.stripePaymentLink = newPaymentLink.url
    }
  }
  return data
}
