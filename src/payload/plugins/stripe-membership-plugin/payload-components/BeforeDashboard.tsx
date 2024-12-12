'use client'

import { useState } from 'react'

const BeforeDashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState('')

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'IN', name: 'India' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'BR', name: 'Brazil' },
  ]

  const handleClick = async () => {
    if (!selectedCountry) {
      alert('Please select a country')
      return
    }

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
        throw new Error('Failed to send invoices')
      }
      const data = await res.json()
      if (data) {
        window.location.href = data
      }
      console.log({ data })
    } catch (error) {
      console.error('Error sending invoices:', error)
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
      <select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}>
        <option value=''>Select a Country</option>
        {countries.map(country => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>

      <div>
        <button
          onClick={handleClick}
          disabled={!selectedCountry}
          style={{
            background: selectedCountry ? 'black' : 'gray',
            padding: '10px 20px',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: selectedCountry ? 'pointer' : 'not-allowed',
          }}>
          connect stripe
        </button>
      </div>
    </div>
  )
}

export default BeforeDashboard
