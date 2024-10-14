import { env } from '@env'
import { CollectionAfterDeleteHook } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY!)

export const afterDeleteCard: CollectionAfterDeleteHook = async ({ doc }) => {
  const { paymentMethodId } = doc

  try {
    await stripe.paymentMethods.detach(paymentMethodId)
  } catch (error) {
    throw new Error('Error deleting payment method')
  }
}
