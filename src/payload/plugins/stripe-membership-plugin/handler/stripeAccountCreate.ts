import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const preferredRegion = 'auto'

export const stripeAccountCreateAndLink = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  publicURI: string,
) => {
  const body = await request.json!()

  const { userId, email, country } = body

  if (!userId) {
    return ''
  }

  let accountId

  try {
    if (country === 'IN') {
      const connectedAccount = await stripeSdk.accounts.create({
        email: email,
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
          userId: userId,
          email: email,
          country: country,
        },
      })

      accountId = connectedAccount.id
    } else {
      const connectedAccount = await stripeSdk.accounts.create({
        email: email,
        country: country,
        type: 'express',
        capabilities: {
          transfers: {
            requested: true,
          },
        },
        metadata: {
          userId: userId,
          email: email,
          country: country,
        },
      })

      accountId = connectedAccount.id
    }

    const accountLink = await stripeSdk.accountLinks.create({
      account: accountId,
      refresh_url: `${publicURI}/admin`,
      return_url: `${publicURI}/api/v1/stripe/success?accountId=${accountId}&userId=${userId}`,
      type: 'account_onboarding',
    })

    return accountLink.url
  } catch (error) {
    console.error('Stripe Connect Error:', error)
    throw error
  }
}
