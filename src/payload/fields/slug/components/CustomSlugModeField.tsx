'use client'

import { RadioGroupField, useFormFields } from '@payloadcms/ui'
import { RadioFieldClientProps } from 'payload'
import React, { useEffect } from 'react'

export const CustomSlugModeField: React.FC<RadioFieldClientProps> = ({
  ...props
}) => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatch,
  }))

  const isHome = fields?.isHome?.value
  const isDynamic = fields?.isDynamic?.value
  const slugMode = fields?.slugMode?.value

  useEffect(() => {
    const value = Boolean(isHome || isDynamic) ? 'generate' : slugMode

    dispatch({
      type: 'UPDATE',
      path: 'slugMode',
      value,
    })
  }, [isHome, isDynamic, dispatch])

  const readOnly = Boolean(isHome || isDynamic)

  return <RadioGroupField {...props} readOnly={readOnly} />
}
