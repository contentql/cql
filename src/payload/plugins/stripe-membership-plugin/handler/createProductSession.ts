import { generateRandomString } from '../../../../utils/generateRandomString'
import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const createProductSession = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  publicURI: string,
) => {
  const body = await request.json!()

  const { userId, country, products } = body

  // Transform products into Stripe line items with individual quantities
  const lineItems = products.map((product: any) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
      },
      unit_amount: Math.round(product.price * 100), // Convert to cents
    },
    quantity: product.quantity,
  }))

  const totalAmount = products.reduce(
    (total: number, product: { price: number; quantity: number }) =>
      total + product.price * product.quantity,
    0,
  )

  try {
    const user = await request.payload.findByID({
      collection: 'users',
      id: userId,
    })

    const stripeConnectedAccount = await request.payload.find({
      collection: 'users',
      where: {
        and: [
          { role: { equals: 'admin' } }, // Match role as 'admin'
          { stripe_user_id: { exists: true } }, // Ensure stripe_user_id exists
        ],
      },
    })

    let session

    if (country === 'IN') {
      const transferId = generateRandomString(6)
      const returnSession = await stripeSdk.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          accountId: stripeConnectedAccount.docs[0].stripe_user_id,
          userId: user.stripe_customer_code,
          transferId: transferId,
          totalAmount: totalAmount,
        },
        payment_intent_data: {
          transfer_group: transferId,
        },
        customer: user.stripe_customer_code,
        mode: 'payment',
        success_url: publicURI,
        invoice_creation: { enabled: true },
      })

      session = returnSession
    } else {
      const returnSession = await stripeSdk.checkout.sessions.create({
        line_items: lineItems,
        payment_intent_data: {
          application_fee_amount: Math.round(totalAmount * 0.04 * 100), // 4% fee
          transfer_data: {
            destination: stripeConnectedAccount.docs[0].stripe_user_id,
          },
        },
        customer: user.stripe_customer_code,
        mode: 'payment',
        success_url: publicURI,
        metadata: {
          accountId: stripeConnectedAccount.docs[0].stripe_user_id,
          userId: user.stripe_customer_code,
        },
        invoice_creation: { enabled: true },
      })
      session = returnSession
    }

    return {
      success: true,
      sessionId: session.id,
      sessionUrl: session.url, // Checkout page URL
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
    return {
      success: false,
      error: error,
    }
  }
}
