'use client'
// This is a client component

import { TextField, useFormFields } from '@payloadcms/ui'
import { TextFieldClientProps } from 'payload'
import React from 'react'

export const CustomPathField: React.FC<TextFieldClientProps> = props => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatch,
  }))

  const readOnly = fields?.pathMode?.value
    ? fields?.pathMode?.value === 'generate'
    : true

  return <TextField {...props} readOnly={readOnly} />
}
