import { collectionSlug } from '../../../../core/collectionSlug.js'
import type {
  CustomField,
  CustomGlobalConfig,
} from '../../../../core/payload-overrides.js'
import { isAdmin } from '../../../../payload/access/isAdmin.js'
import { SETTINGS_GROUP } from '../../../../payload/collections/constants.js'
import { currencyField } from '../../../../payload/fields/common/currency/index.js'
import { themeSettingsTab } from '../../../../payload/fields/common/theme/index.js'
import { z } from 'zod'

const validateURL = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  .url()

const menuItem: CustomField[] = [
  {
    type: 'row',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  },
  {
    name: 'icon',
    type: 'upload',
    label: 'Icon',
    relationTo: 'media',
    admin: {
      description: 'Upload an svg or logo to be displayed with link',
    },
  },
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Label',
        required: true,
      },
      {
        type: 'relationship',
        name: 'page',
        relationTo: ['pages'],
        admin: {
          condition: (_data, siblingData) => {
            return siblingData.type === 'reference'
          },
        },
        required: true,
        maxDepth: 1,
      },
      {
        name: 'url',
        type: 'text',
        label: 'URL',
        admin: {
          condition: (_data, siblingData) => siblingData.type === 'custom',
        },
        required: true,
      },
    ],
  },
]

const menuGroupItem = (isNavbar = false): CustomField => ({
  type: 'group',
  name: 'menuLinkGroup',
  label: 'Link Group',
  fields: [
    {
      type: 'text',
      name: 'groupTitle',
      label: 'Group Title',
      required: true,
    },
    {
      type: 'array',
      name: 'groupLinks',
      label: 'Links',
      fields: menuItem,
      dbName: isNavbar ? 'navbarLinks' : 'footerLinks',
    },
  ],
  admin: {
    condition: (_data, siblingData) => siblingData.group,
  },
})

const menuField = (isNavbar = false): CustomField[] => {
  return [
    {
      type: 'checkbox',
      name: 'group',
      label: 'Group',
      defaultValue: false,
      admin: {
        description: 'Check to create group of links',
      },
    },
    {
      name: 'menuLink',
      type: 'group',
      label: 'Link',
      fields: menuItem,
      admin: {
        condition: (_data, siblingData) => !siblingData.group,
      },
    },
    menuGroupItem(isNavbar),
  ]
}

const logoField: CustomField[] = [
  {
    name: 'imageUrl',
    type: 'upload',
    required: true,
    relationTo: 'media',
    label: 'Image',
  },
  {
    type: 'row',
    fields: [
      {
        label: 'Height',
        name: 'height',
        type: 'number',
        admin: {
          description: 'Adjust to the height of the logo',
        },
      },
      {
        label: 'Width',
        name: 'width',
        type: 'number',
        admin: {
          description: 'Adjust to the width of the logo',
        },
      },
    ],
  },
]

export const socialLinksField: CustomField = {
  type: 'row',
  fields: [
    {
      type: 'select',
      name: 'platform',
      label: 'Platform',
      required: true,
      options: [
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'Facebook',
          value: 'facebook',
        },
        {
          label: 'Instagram',
          value: 'instagram',
        },
        {
          label: 'Twitter',
          value: 'twitter',
        },
        {
          label: 'LinkedIn',
          value: 'linkedin',
        },
        {
          label: 'YouTube',
          value: 'youtube',
        },
        {
          label: 'TikTok',
          value: 'tiktok',
        },
        {
          label: 'Pinterest',
          value: 'pinterest',
        },
        {
          label: 'Snapchat',
          value: 'snapchat',
        },
        {
          label: 'Reddit',
          value: 'reddit',
        },
        {
          label: 'Tumblr',
          value: 'tumblr',
        },
        {
          label: 'WhatsApp',
          value: 'whatsapp',
        },
        {
          label: 'Telegram',
          value: 'telegram',
        },
        {
          label: 'GitHub',
          value: 'github',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Quora',
          value: 'quora',
        },
        {
          label: 'Discord',
          value: 'discord',
        },
      ],
    },
    {
      type: 'text',
      name: 'value',
      label: 'Link',
      required: true,
      validate: (value: any, args: any) => {
        const { success } = validateURL.safeParse(value)

        return success || 'Link is not valid'
      },
    },
  ],
}

export const siteSettings: CustomGlobalConfig = {
  slug: collectionSlug['site-settings'],
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: SETTINGS_GROUP,
  },
  fields: [
    {
      type: 'tabs',
      label: 'Settings',
      tabs: [
        {
          label: 'General',
          name: 'general',
          fields: [
            { type: 'text', name: 'title', required: true },
            {
              type: 'textarea',
              name: 'description',
              required: true,
            },
            {
              name: 'faviconUrl',
              type: 'upload',
              required: true,
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'We recommend a maximum size of 256 * 256 pixels',
              },
            },
            {
              name: 'ogImageUrl',
              type: 'upload',
              required: true,
              relationTo: 'media',
              label: 'OG Image',
              admin: {
                description: 'We recommend a maximum size of 1200 * 630 pixels',
              },
            },
            {
              name: 'keywords',
              type: 'text',
              hasMany: true,
            },
            currencyField,
          ],
        },
        {
          label: 'Navbar',
          name: 'navbar',
          fields: [
            {
              name: 'logo',
              type: 'group',
              interfaceName: 'BrandLogo', // optional
              label: 'Logo',
              fields: logoField,
            },
            {
              name: 'menuLinks',
              label: 'Menu Links',
              type: 'array',
              fields: menuField(true),
              dbName: 'navbarMenu',
            },
          ],
        },
        {
          label: 'Footer',
          name: 'footer',
          fields: [
            {
              name: 'logo',
              type: 'group',
              interfaceName: 'BrandLogo', // optional
              label: 'Logo',
              fields: [
                ...logoField,
                {
                  type: 'text',
                  label: 'Description',
                  name: 'description',
                  admin: {
                    description: 'This text appears below the footer image',
                  },
                },
              ],
            },
            {
              name: 'footerLinks',
              type: 'array',
              label: 'Footer Links',
              fields: menuField(),
              dbName: 'FooterMenu',
            },
            {
              type: 'array',
              name: 'socialLinks',
              label: 'Social Links',
              fields: [socialLinksField],
            },
            { type: 'text', name: 'copyright', label: 'Copyright' },
          ],
        },
        themeSettingsTab,
      ],
    },
  ],
}
