import { sendMessageToClient } from '../../../../utils/client'
import { PayloadRequest } from 'payload'
import Stripe from 'stripe'

export const stripeWebhook = async (
  request: PayloadRequest,
  stripeSdk: Stripe,
  stripeWebhookSecret: string,
) => {
  const { payload } = request

  const body = await request.text!()
  const sig = request.headers.get('stripe-signature')!

  async function createNewOrder(finalizeInvoice: any) {
    console.log({ finalizeInvoice })
    const data = finalizeInvoice.lines.data
    console.log({ data })
    const productsJSON = data.map((item: any) => {
      // const [quantity, rest] = item.description.split(' × ')
      // const [name, priceInfo] = rest.split(' (at ')
      // const price = priceInfo.replace(' / month)', '')

      return {
        name: item.description,
        amount: Math.round(item.amount / 100),
        quantity: 1,
      }
    })
    console.log({ productsJSON })
    try {
      const user = await payload.find({
        collection: 'users',
        where: {
          stripe_customer_code: {
            equals: finalizeInvoice.customer,
          },
        },
      })

      await payload.create({
        collection: 'orders',
        data: {
          user: user.docs[0].id,
          amount: finalizeInvoice.total / 100,
          currency: finalizeInvoice.currency,
          status: finalizeInvoice.status,
          invoiceId: finalizeInvoice.id,
          invoiceUrl: finalizeInvoice.hosted_invoice_url,
          invoicePdf: finalizeInvoice.invoice_pdf,
          products: productsJSON,
          userEmail: user.docs[0].email,
          paymentError: '',
        },
      })
    } catch (error) {
      console.log('Error creating order', error)
    }
  }

  async function updateOrderStatus(id: string, status: boolean) {
    try {
      const order = await payload.find({
        collection: 'orders',
        where: {
          invoiceId: {
            equals: id,
          },
        },
      })

      if (order.docs.length > 0) {
        await payload.update({
          collection: 'orders',
          id: order.docs[0].id,
          data: {
            status: status ? 'paid' : 'failed',
          },
        })
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  async function updateUserPlan(
    customerCode: string,
    planId: string,
    currentPeriodEnd: number,
    status: string,
    subscriptionId: string,
  ) {
    console.log({
      customerCode,
      planId,
      currentPeriodEnd,
      status,
      subscriptionId,
    })

    let user: any | undefined = undefined

    try {
      const { docs: users, totalDocs: totalUsers } = await payload.find({
        collection: 'users',
        where: {
          stripe_customer_code: {
            equals: customerCode,
          },
        },
      })

      user = users?.at(0)

      if (user) {
        const planMap = {
          prod_Qzsi2IObXBgrWE: 'pro',
          prod_QzsePhRjxKakW9: 'enterprise',
        } as const

        const newPlan = planMap[planId as keyof typeof planMap] || 'free'

        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            user_plan: newPlan,
            last_billed_date: new Date().toISOString(),
            plan_end_date: new Date(currentPeriodEnd * 1000).toISOString(),
            subscription_status: status,
            stripe_subscription_id: subscriptionId,
          },
        })

        sendMessageToClient(
          user.id,
          JSON.stringify({
            process: 'USER_SUBSCRIPTION',
            status: 'SUCCESS',
          }),
        )
      } else {
        throw new Error('User not found!')
      }
    } catch (error) {
      if (user) {
        sendMessageToClient(
          user.id,
          JSON.stringify({
            process: 'USER_SUBSCRIPTION',
            status: 'FAIL',
          }),
        )
      }
      console.log('Error updating user plan', error)
    }
  }

  async function updateUserWalletAmount(updatedCustomer: any) {
    let user: any | undefined = undefined

    try {
      const { docs: users, totalDocs: totalUsers } = await payload.find({
        collection: 'users',
        where: {
          stripe_customer_code: {
            equals: updatedCustomer.id,
          },
        },
      })

      user = users?.at(0)

      if (user) {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            wallet: -updatedCustomer.balance / 100,
          },
        })
      }
    } catch (error) {
      console.log('error updating wallet amount', error)
    }
  }

  async function handleSubscriptionChange(subscription: any) {
    const customerId = subscription.customer
    const subscriptionId = subscription.id
    const planId = subscription.items.data[0].plan.product // Assuming single plan subscription
    const status = subscription.status
    const currentPeriodEnd = subscription.current_period_end

    if (status === 'active') {
      await updateUserPlan(
        customerId,
        planId,
        currentPeriodEnd,
        status,
        subscriptionId,
      )
    } else if (status === 'canceled') {
      // Store the cancellation date, but don't change the plan yet
      await updateUserPlan(
        customerId,
        planId,
        currentPeriodEnd,
        status,
        subscriptionId,
      )
      console.log(
        `Subscription canceled, plan will be updated after ${new Date(currentPeriodEnd * 1000).toISOString()}`,
      )
    }
  }

  let event

  try {
    event = stripeSdk.webhooks.constructEvent(body, sig, stripeWebhookSecret)
  } catch (error) {
    return Response.json({ error: `Webhook Error` }, { status: 400 })
  }

  switch (event.type) {
    case 'invoice.payment_failed':
      const failedPaymentIntent = event.data.object
      await updateOrderStatus(failedPaymentIntent.id, failedPaymentIntent.paid)
      break
    case 'invoice.payment_succeeded':
      const paymentIntent = event.data.object
      await updateOrderStatus(paymentIntent.id, paymentIntent.paid)
      break
    case 'invoice.finalized':
      const finalizeInvoice = event.data.object
      await createNewOrder(finalizeInvoice)
      break
    case 'customer.updated':
      const updatedCustomer = event.data.object
      console.log({ updatedCustomer })
      await updateUserWalletAmount(updatedCustomer)
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object
      const sub = event
      await handleSubscriptionChange(subscription)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return { received: true }
}
