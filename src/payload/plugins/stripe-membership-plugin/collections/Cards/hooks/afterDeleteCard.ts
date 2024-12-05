import {
  CollectionAfterDeleteHook,
  PayloadRequest,
  RequestContext,
  SanitizedCollectionConfig,
} from 'payload'
import Stripe from 'stripe'

interface HookType {
  stripe: Stripe
  collection: SanitizedCollectionConfig
  context: RequestContext
  doc: any
  id: number | string
  req: PayloadRequest
}

export const afterDeleteCard =
  (stripe: any): CollectionAfterDeleteHook =>
  async ({ doc }) => {
    const { paymentMethodId } = doc

    try {
      await stripe.paymentMethods.detach(paymentMethodId)
    } catch (error) {
      throw new Error('Error deleting payment method')
    }
  }
