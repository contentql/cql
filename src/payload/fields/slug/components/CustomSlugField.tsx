'use client'

import { formatString } from '../utils/formatString'
import { TextField, useFormFields } from '@payloadcms/ui'
import { TextFieldClientProps } from 'payload'
import React, { useEffect } from 'react'

interface CustomClientProps {
  fieldToUse: string
}

export const CustomSlugField: React.FC<
  TextFieldClientProps & CustomClientProps
> = ({ fieldToUse, ...props }) => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatch,
  }))

  const fieldName = props?.field?.name as string
  const fieldValue = fields[fieldName]?.value as string
  const title = fields[fieldToUse]?.value
  const isHome = fields?.isHome?.value
  const slugMode = fields?.slugMode?.value

  useEffect(() => {
    if (!title) return

    const formattedTitle = isHome ? '/' : formatString(String(title || ''))
    const formattedFieldData = formatString(String(fieldValue || ''))

    let updatedValue: string

    if (slugMode === 'generate') {
      updatedValue = formattedTitle
    } else if (slugMode === 'custom') {
      updatedValue = formattedFieldData
    } else {
      updatedValue = formattedTitle
    }

    dispatch({
      type: 'UPDATE',
      path: fieldName,
      value: updatedValue,
    })
  }, [title, isHome, fieldValue, slugMode, dispatch, fieldName])

  const readOnly =
    fieldToUse !== fieldName &&
    (slugMode === 'generate' || slugMode === undefined)

  return <TextField {...props} readOnly={readOnly} />
}
