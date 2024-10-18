import {
  PayloadRequest,
  RequestContext,
  SanitizedCollectionConfig,
} from 'payload'
import Stripe from 'stripe'

interface HookType {
  stripe: Stripe
  collection: SanitizedCollectionConfig
  context: RequestContext
  data: Partial<any>
  operation: 'create' | 'update'
  originalDoc?: any
  req: PayloadRequest
}

export const handleStripeProductAndPrice = async ({
  operation,
  data,
  originalDoc,
  stripe,
}: HookType) => {
  if (operation === 'create') {
    const product = await stripe.products.create({
      name: data.name,
    })
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: data.price * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
    })

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    })

    data.stripeProductId = product.id
    data.stripePriceId = price.id
    data.stripePaymentLink = paymentLink.url
  } else if (operation === 'update') {
    // Check if name has changed
    if (data.name !== originalDoc.name) {
      await stripe.products.update(data.stripeProductId, {
        name: data.name,
      })
    }

    // Check if price has changed
    if (data.price !== originalDoc.price) {
      const newPrice = await stripe.prices.create({
        product: data.stripeProductId,
        unit_amount: data.price * 100,
        currency: 'usd',
        recurring: { interval: 'month' },
      })

      // Generate new payment link with the updated price
      const newPaymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: newPrice.id, quantity: 1 }],
      })

      // Update data with the new price ID and payment link
      data.stripePriceId = newPrice.id
      data.stripePaymentLink = newPaymentLink.url
    }
  }
  return data
}
