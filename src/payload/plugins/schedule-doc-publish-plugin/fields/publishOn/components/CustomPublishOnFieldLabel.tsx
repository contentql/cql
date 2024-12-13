'use client'

import { FieldLabel, useFormFields, useFormModified } from '@payloadcms/ui'
import { DateFieldClientProps } from 'payload'
import React, { useEffect, useState } from 'react'

export const CustomPublishOnFieldLabel: React.FC<
  DateFieldClientProps
> = props => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatch,
  }))

  const isFormModified = useFormModified()
  const status = fields?._status?.value
  const publishOn = fields?.publishOn?.value

  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)

  useEffect(() => {
    const targetDate = new Date(String(publishOn)).getTime()

    if (
      publishOn &&
      (status !== 'published' || isFormModified) &&
      targetDate > Date.now()
    ) {
      const updateTimeRemaining = () => {
        const now = Date.now()
        const timeDifference = targetDate - now

        if (timeDifference <= 0) {
          setTimeRemaining('Published')
        } else {
          const days = Math.floor(timeDifference / (1000 * 3600 * 24))
          const hours = Math.floor(
            (timeDifference % (1000 * 3600 * 24)) / (1000 * 3600),
          )
          const minutes = Math.floor(
            (timeDifference % (1000 * 3600)) / (1000 * 60),
          )
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }
      }

      updateTimeRemaining()
      const interval = setInterval(updateTimeRemaining, 1000)

      return () => clearInterval(interval)
    } else {
      setTimeRemaining(null)
    }
  }, [isFormModified, publishOn, status])

  return (
    <div
      className='flex flex-row'
      style={{ display: 'flex', justifyContent: 'space-between' }}>
      <FieldLabel {...props} label={props?.field?.label ?? ''} />
      <FieldLabel {...props} label={timeRemaining || ''} />
    </div>
  )
}

export default CustomPublishOnFieldLabel
