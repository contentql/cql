'use client'

import { useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

const BeforeDashboard = () => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatch,
  }))

  const selectedCountry = fields?.['stripeConnect.country']?.value
  const selectedCurrency = fields?.['stripeConnect.currency']?.value
  const stripeUserId = fields?.['stripeConnect.stripeUserId']?.value
  const stripeDashboardUrl =
    fields?.['stripeConnect.stripeAdminDashboard']?.value

  const [isLoading, setIsLoading] = useState(false)

  console.log({
    selectedCountry,
    selectedCurrency,
    stripeUserId,
    stripeDashboardUrl,
  })

  const handleClick = async () => {
    setIsLoading(true) // Start loading
    try {
      const res = await fetch('/api/v1/stripe/account_create_and_link', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountry,
        }),
      })
      if (!res.ok) {
        throw new Error('Failed to connect Stripe')
      }
      const data = await res.json()
      if (data) {
        window.location.href = data
      }
      console.log({ data })
    } catch (error) {
      console.error('Error connecting Stripe:', error)
    } finally {
      setIsLoading(false) // Stop loading
    }
  }

  const handleDashboardClick = () => {
    if (stripeDashboardUrl) {
      window.open(stripeDashboardUrl as string, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '300px',
      }}>
      <div>
        {stripeUserId ? (
          <button
            style={{
              background: 'black',
              padding: '10px 10px 10px',
              marginBottom: '20px',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleDashboardClick}
            disabled={!stripeDashboardUrl}>
            Dashboard
          </button>
        ) : (
          <button
            style={{
              background: isLoading ? 'gray' : 'black',
              padding: '10px 20px 10px',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            onClick={handleClick}
            disabled={isLoading || !selectedCountry || !selectedCurrency}>
            {isLoading ? 'Connecting...' : 'Connect Stripe'}
          </button>
        )}
      </div>
    </div>
  )
}

export default BeforeDashboard
