import { CustomField } from '../../../../core/payload-overrides'
import { Tab } from 'payload'
import { z } from 'zod'

const validateURL = z
  .string({
    required_error: 'URL is required',
  })
  .url({
    message: 'Please enter a valid URL',
  })

const fontValidation = (
  value: string | string[] | null | undefined,
): true | string => {
  // Ensure value is a string, as it can also be an array or null/undefined
  if (typeof value === 'string') {
    const { success } = validateURL.safeParse(value)
    return success || 'Google Font URL is invalid'
  }
  return 'Google Font URL is invalid'
}

const fontConfig = ({
  remoteFont,
  fontName,
}: {
  remoteFont: string
  fontName: string
}): CustomField[] => [
  {
    name: 'customFont',
    label: 'Custom Font',
    type: 'upload',
    relationTo: 'media',
    admin: {
      width: '50%',
      condition: (_data, siblingData) => {
        return siblingData.type === 'customFont'
      },
    },
  },
  {
    name: 'remoteFont',
    type: 'text',
    required: true,
    label: 'Google Font URL',
    admin: {
      width: '50%',
      condition: (_data, siblingData) => {
        return siblingData.type === 'googleFont'
      },
    },
    defaultValue: remoteFont,
    validate: fontValidation,
  },
  {
    name: 'fontName',
    type: 'text',
    required: true,
    label: 'Font Name',
    admin: {
      width: '50%',
      condition: (_data, siblingData) => {
        return siblingData.type === 'googleFont'
      },
    },
    defaultValue: fontName,
  },
]

export const themeSettingsTab: Tab = {
  name: 'themeSettings',
  fields: [
    {
      type: 'row',
      fields: [
        {
          type: 'group',
          name: 'lightMode',
          fields: [
            {
              type: 'text',
              name: 'primary',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#C084FC',
            },
            {
              type: 'text',
              name: 'background',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#F8FAFC',
            },
            {
              type: 'text',
              name: 'text',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#0F0F0F',
            },
            {
              type: 'text',
              name: 'foreground',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#E2E8F0',
            },
            {
              type: 'text',
              name: 'popover',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#000000',
            },
            {
              type: 'text',
              name: 'border',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#000000',
            },
          ],
        },
        {
          type: 'group',
          name: 'darkMode',
          fields: [
            {
              type: 'text',
              name: 'primary',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#60A5FA',
            },
            {
              type: 'text',
              name: 'background',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#0F172A',
            },
            {
              type: 'text',
              name: 'text',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#FFFAFA',
            },
            {
              type: 'text',
              name: 'foreground',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#1E293B',
            },
            {
              type: 'text',
              name: 'popover',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#000000',
            },
            {
              type: 'text',
              name: 'border',
              admin: {
                components: {
                  Field: '@contentql/core/client#ColorField',
                },
              },
              required: true,
              defaultValue: '#000000',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'fonts',
      fields: [
        {
          type: 'group',
          name: 'display',
          label: 'Display Font',
          fields: [
            {
              name: 'type',
              type: 'radio',
              required: true,
              options: [
                {
                  label: 'Custom Font',
                  value: 'customFont',
                },
                {
                  label: 'Google Font',
                  value: 'googleFont',
                },
              ],
              defaultValue: 'googleFont',
            },
            {
              type: 'row',
              fields: fontConfig({
                remoteFont:
                  'https://fonts.googleapis.com/css2?family=Chewy&display=swap',
                fontName: 'Chewy',
              }),
            },
          ],
        },
        {
          type: 'group',
          name: 'body',
          label: 'Body Font',
          fields: [
            {
              name: 'type',
              type: 'radio',
              required: true,
              options: [
                {
                  label: 'Custom Font',
                  value: 'customFont',
                },
                {
                  label: 'Google Font',
                  value: 'googleFont',
                },
              ],
              defaultValue: 'googleFont',
            },
            {
              type: 'row',
              fields: fontConfig({
                remoteFont:
                  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
                fontName: 'Roboto',
              }),
            },
          ],
        },
      ],
    },
    {
      admin: {
        components: {
          Field: '@contentql/core/client#RadiusField',
        },
      },
      type: 'select',
      name: 'radius',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
        {
          label: 'Full',
          value: 'full',
        },
      ],
      required: true,
      defaultValue: 'none',
    },
  ],
}
