import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const stripeConnect = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  stripeOauthClientId: string,
  publicURI: string,
) => {
  const { payload } = request

  const body = await request.json!()

  console.log({ body })

  const { userId } = body

  if (!userId) {
    return ''
  }

  const state = Buffer.from(userId).toString('base64')

  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: stripeOauthClientId,
    scope: 'read_write',
    redirect_uri: `${publicURI}/api/v1/stripe/oauth`,
    state,
  })

  return `https://connect.stripe.com/oauth/authorize?${queryParams.toString()}`
}
