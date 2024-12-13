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

      const updateSiteSettings = await request.payload.updateGlobal({
        slug: 'site-settings',
        depth: 2,
        data: {
          stripeConnect: {
            stripeUserId: accountId,
            stripeAdminDashboard: dashboardLink.url,
          },
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
        success: true,
        url: dashboardLink.url,
        message: 'Account details not submitted',
      }
    }

    return {
      success: false,
      url: `${publicURI}/admin`,
      message: 'Account details not submitted',
    }
  } catch (error) {
    console.error('Stripe Connect Error:', error)
    throw error
  }
}
