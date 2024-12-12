import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const preferredRegion = 'auto'

export const stripeAccountCreateAndLink = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  publicURI: string,
) => {
  const body = await request.json!()
  const { user } = request
  const { country } = body

  if (!user) {
    throw Error('User not found')
  }

  // Add type guard to ensure email is a string
  if (!user.email) {
    throw Error('User email is required')
  }
  let accountId

  try {
    if (country === 'IN') {
      const connectedAccount = await stripeSdk.accounts.create({
        email: user.email,
        country: country,
        type: 'express',
        capabilities: {
          transfers: {
            requested: true,
          },
        },
        tos_acceptance: {
          service_agreement: 'recipient',
        },
        metadata: {
          userId: user.id,
          email: user.email,
          country: country,
        },
      })

      accountId = connectedAccount.id
    } else {
      const connectedAccount = await stripeSdk.accounts.create({
        email: user.email,
        country: country,
        type: 'express',
        capabilities: {
          transfers: {
            requested: true,
          },
        },
        metadata: {
          userId: user.id,
          email: user.email,
          country: country,
        },
      })

      accountId = connectedAccount.id
    }

    const accountLink = await stripeSdk.accountLinks.create({
      account: accountId,
      refresh_url: `${publicURI}/admin`,
      return_url: `${publicURI}/api/v1/stripe/success?accountId=${accountId}&userId=${user.id}`,
      type: 'account_onboarding',
    })

    return accountLink.url
  } catch (error) {
    console.error('Stripe Connect Error:', error)
    throw error
  }
}
