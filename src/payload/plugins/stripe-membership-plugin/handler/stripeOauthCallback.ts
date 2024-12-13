import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const stripeOauthCallback = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  stripeOauthClientId: string,
  publicURI: string,
) => {
  const code = request.searchParams.get('code')
  const state = request.searchParams.get('state')

  const payload = request.payload

  if (!code) {
    throw Error('No code')
  }

  if (!state) {
    throw Error('No state')
  }

  const userId = Buffer.from(state, 'base64').toString('utf-8')

  let stripe_user_id

  try {
    const response = await stripeSdk.oauth.token({
      grant_type: 'authorization_code',
      code,
    })

    stripe_user_id = response.stripe_user_id
  } catch (error) {
    throw Error('Error creating account')
  }

  const updatedUser = await payload.update({
    collection: 'users',
    id: userId,
    data: {
      stripe_user_id: stripe_user_id,
    },
  })

  await stripeSdk.accounts.update(stripe_user_id!, {
    metadata: {
      userId: userId,
      email: updatedUser.email,
    },
  })

  return stripe_user_id
}
