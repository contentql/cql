'use client'

import { useField } from '@payloadcms/ui'
import { TextFieldClientProps } from 'payload'

const ColorField = ({ ...props }: TextFieldClientProps) => {
  const { value = '', setValue } = useField<string>({ path: props.path })
  const label = typeof props.field.label === 'string' ? props.field.label : ''

  return (
    <>
      <label htmlFor={props.path}>{label}</label>

      <div className='color-field-container'>
        <input
          id={props.path}
          type='color'
          className='color-field-selector'
          value={value.startsWith('#') ? value : `#${value}`}
          onChange={e => {
            const newValue = e.target.value
            setValue(newValue.startsWith('#') ? newValue : `#${newValue}`)
          }}
        />

        <input
          type='text'
          value={value.startsWith('#') ? value : `#${value}`}
          onChange={e => {
            const newValue = e.target.value
            setValue(newValue.startsWith('#') ? newValue : `#${newValue}`)
          }}
        />
      </div>
    </>
  )
}

export default ColorField
