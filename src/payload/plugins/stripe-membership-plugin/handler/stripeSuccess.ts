import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const stripeSuccess = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  publicURI: string,
) => {
  const userId = request.searchParams.get('userId')
  const accountId = request.searchParams.get('accountId')

  if (!userId || !accountId) {
    throw new Error('Missing required parameters: userId and accountId')
  }

  try {
    const account = await stripeSdk.accounts.retrieve(accountId)

    if (account.details_submitted) {
      const dashboardLink = await stripeSdk.accounts.createLoginLink(account.id)

      const updatedUser = await request.payload.update({
        collection: 'users',
        id: userId,
        data: {
          stripe_user_id: accountId,
          stripe_express_dashboard_url: dashboardLink.url,
        },
      })

      const createSubscription = await request.payload.create({
        collection: 'subscriptionPlans',
        data: {
          name: 'premium',
          price: 10,
        },
      })

      return {
        stripeExpressUrl: account.id,
      }
    }

    return {
      success: false,
      message: 'Account details not submitted',
    }
  } catch (error) {
    console.error('Stripe Connect Error:', error)
    throw error
  }
}
