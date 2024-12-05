import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const stripeAccountCreateAndLink = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  publicURI: string,
) => {
  const { payload } = request

  const body = await request.json!()

  console.log({ body })

  const { userId, email } = body

  if (!userId) {
    return ''
  }

  try {
    const connectedAccount = await stripeSdk.accounts.create({
      email: email,
      type: 'express',
      //   controller: {
      //     fees: {
      //       payer: 'application',
      //     },
      //     losses: {
      //       payments: 'application',
      //     },
      //     stripe_dashboard: {
      //       type: 'express',
      //     },
      //   },
      metadata: {
        userId: userId,
        email: email,
      },
    })

    const accountLink = await stripeSdk.accountLinks.create({
      account: connectedAccount.id,
      refresh_url: `${publicURI}/admin`,
      return_url: `${publicURI}/api/v1/stripe/success?accountId=${connectedAccount.id}&userId=${userId}`,
      type: 'account_onboarding',
    })

    return accountLink.url
  } catch (error) {
    console.error('Stripe Connect Error:', error)
    throw error
  }
}
