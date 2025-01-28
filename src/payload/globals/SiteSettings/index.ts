import { collectionSlug } from '../../../core/collectionSlug.js'
import { isAdmin } from '../../access/isAdmin.js'
import { SETTINGS_GROUP } from '../../collections/constants.js'
import { currencyField } from '../../fields/common/currency/index.js'
import { themeSettingsTab } from '../../fields/common/theme/index.js'
import type { Field, GlobalConfig } from 'payload'
import { z } from 'zod'

const validateURL = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  .url()

const menuItem: Field[] = [
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

const menuGroupItem = (isNavbar = false): Field => ({
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

const menuField = (isNavbar = false): Field[] => {
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

const logoField: Field[] = [
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

export const socialLinksField: Field = {
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

export const siteSettings: GlobalConfig = {
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
        {
          label: 'Redirection Links',
          name: 'redirectionLinks',
          fields: [
            {
              name: 'blogLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Blog redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirects to a blog details page',
              },
            },
            {
              name: 'productLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Product redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirect to a product details page',
              },
            },
            {
              name: 'authorLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Author redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirects to a author details page',
              },
            },
            {
              name: 'tagLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Tag redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirects to a tag details page',
              },
            },
          ],
        },
        {
          label: 'Monetization',
          name: 'monetization',
          fields: [
            {
              name: 'adSenseId',
              type: 'text',
              label: 'Google AdSense',
              admin: {
                description: 'Add the publisher-id from Google AdSense Console',
              },
            },
            {
              name: 'measurementId',
              type: 'text',
              label: 'Google Analytics Measurement ID',
              admin: {
                description:
                  'Add the measurement id from Google Analytics dashboard',
              },
            },
          ],
        },
        themeSettingsTab,
        // {
        //   name: 'stripeConnect',
        //   label: 'Stripe Connect',
        //   fields: [
        //     {
        //       name: 'country',
        //       label: 'Country',
        //       type: 'select',
        //       options: [
        //         { label: 'Albania', value: 'AL' },
        //         { label: 'Algeria', value: 'DZ' },
        //         { label: 'Angola', value: 'AO' },
        //         { label: 'Antigua & Barbuda', value: 'AG' },
        //         { label: 'Argentina', value: 'AR' },
        //         { label: 'Armenia', value: 'AM' },
        //         { label: 'Australia', value: 'AU' },
        //         { label: 'Austria', value: 'AT' },
        //         { label: 'Azerbaijan', value: 'AZ' },
        //         { label: 'Bahamas', value: 'BS' },
        //         { label: 'Bahrain', value: 'BH' },
        //         { label: 'Bangladesh', value: 'BD' },
        //         { label: 'Belgium', value: 'BE' },
        //         { label: 'Benin', value: 'BJ' },
        //         { label: 'Bhutan', value: 'BT' },
        //         { label: 'Bolivia', value: 'BO' },
        //         { label: 'Bosnia & Herzegovina', value: 'BA' },
        //         { label: 'Botswana', value: 'BW' },
        //         { label: 'Brunei', value: 'BN' },
        //         { label: 'Bulgaria', value: 'BG' },
        //         { label: 'Cambodia', value: 'KH' },
        //         { label: 'Canada', value: 'CA' },
        //         { label: 'Chile', value: 'CL' },
        //         { label: 'Colombia', value: 'CO' },
        //         { label: 'Costa Rica', value: 'CR' },
        //         { label: "Côte d'Ivoire", value: 'CI' },
        //         { label: 'Croatia', value: 'HR' },
        //         { label: 'Cyprus', value: 'CY' },
        //         { label: 'Czech Republic', value: 'CZ' },
        //         { label: 'Denmark', value: 'DK' },
        //         { label: 'Dominican Republic', value: 'DO' },
        //         { label: 'Ecuador', value: 'EC' },
        //         { label: 'Egypt', value: 'EG' },
        //         { label: 'El Salvador', value: 'SV' },
        //         { label: 'Estonia', value: 'EE' },
        //         { label: 'Ethiopia', value: 'ET' },
        //         { label: 'Finland', value: 'FI' },
        //         { label: 'France', value: 'FR' },
        //         { label: 'Gabon', value: 'GA' },
        //         { label: 'Gambia', value: 'GM' },
        //         { label: 'Germany', value: 'DE' },
        //         { label: 'Ghana', value: 'GH' },
        //         { label: 'Greece', value: 'GR' },
        //         { label: 'Guatemala', value: 'GT' },
        //         { label: 'Guyana', value: 'GY' },
        //         { label: 'Hong Kong', value: 'HK' },
        //         { label: 'Hungary', value: 'HU' },
        //         { label: 'Iceland', value: 'IS' },
        //         { label: 'India', value: 'IN' },
        //         { label: 'Indonesia', value: 'ID' },
        //         { label: 'Ireland', value: 'IE' },
        //         { label: 'Israel', value: 'IL' },
        //         { label: 'Italy', value: 'IT' },
        //         { label: 'Jamaica', value: 'JM' },
        //         { label: 'Japan', value: 'JP' },
        //         { label: 'Jordan', value: 'JO' },
        //         { label: 'Kazakhstan', value: 'KZ' },
        //         { label: 'Kenya', value: 'KE' },
        //         { label: 'Kuwait', value: 'KW' },
        //         { label: 'Laos', value: 'LA' },
        //         { label: 'Latvia', value: 'LV' },
        //         { label: 'Liechtenstein', value: 'LI' },
        //         { label: 'Lithuania', value: 'LT' },
        //         { label: 'Luxembourg', value: 'LU' },
        //         { label: 'Macao SAR China', value: 'MO' },
        //         { label: 'Madagascar', value: 'MG' },
        //         { label: 'Malaysia', value: 'MY' },
        //         { label: 'Malta', value: 'MT' },
        //         { label: 'Mauritius', value: 'MU' },
        //         { label: 'Mexico', value: 'MX' },
        //         { label: 'Moldova', value: 'MD' },
        //         { label: 'Monaco', value: 'MC' },
        //         { label: 'Mongolia', value: 'MN' },
        //         { label: 'Morocco', value: 'MA' },
        //         { label: 'Mozambique', value: 'MZ' },
        //         { label: 'Namibia', value: 'NA' },
        //         { label: 'Netherlands', value: 'NL' },
        //         { label: 'New Zealand', value: 'NZ' },
        //         { label: 'Niger', value: 'NE' },
        //         { label: 'Nigeria', value: 'NG' },
        //         { label: 'North Macedonia', value: 'MK' },
        //         { label: 'Norway', value: 'NO' },
        //         { label: 'Oman', value: 'OM' },
        //         { label: 'Pakistan', value: 'PK' },
        //         { label: 'Panama', value: 'PA' },
        //         { label: 'Paraguay', value: 'PY' },
        //         { label: 'Peru', value: 'PE' },
        //         { label: 'Philippines', value: 'PH' },
        //         { label: 'Poland', value: 'PL' },
        //         { label: 'Portugal', value: 'PT' },
        //         { label: 'Qatar', value: 'QA' },
        //         { label: 'Romania', value: 'RO' },
        //         { label: 'Rwanda', value: 'RW' },
        //         { label: 'San Marino', value: 'SM' },
        //         { label: 'Saudi Arabia', value: 'SA' },
        //         { label: 'Senegal', value: 'SN' },
        //         { label: 'Serbia', value: 'RS' },
        //         { label: 'Singapore', value: 'SG' },
        //         { label: 'Slovakia', value: 'SK' },
        //         { label: 'Slovenia', value: 'SI' },
        //         { label: 'South Africa', value: 'ZA' },
        //         { label: 'South Korea', value: 'KR' },
        //         { label: 'Spain', value: 'ES' },
        //         { label: 'Sri Lanka', value: 'LK' },
        //         { label: 'St. Lucia', value: 'LC' },
        //         { label: 'Sweden', value: 'SE' },
        //         { label: 'Switzerland', value: 'CH' },
        //         { label: 'Taiwan', value: 'TW' },
        //         { label: 'Tanzania', value: 'TZ' },
        //         { label: 'Thailand', value: 'TH' },
        //         { label: 'Trinidad & Tobago', value: 'TT' },
        //         { label: 'Tunisia', value: 'TN' },
        //         { label: 'Turkey', value: 'TR' },
        //         { label: 'United Arab Emirates', value: 'AE' },
        //         { label: 'United Kingdom', value: 'GB' },
        //         { label: 'Uruguay', value: 'UY' },
        //         { label: 'Uzbekistan', value: 'UZ' },
        //         { label: 'Vietnam', value: 'VN' },
        //       ],
        //     },
        //     {
        //       name: 'currency',
        //       label: 'Currency',
        //       type: 'select',
        //       options: [
        //         { label: 'US Dollar', value: 'usd' },
        //         { label: 'Euro', value: 'eur' },
        //         { label: 'Indian Rupee', value: 'inr' },
        //         { label: 'British Pound', value: 'gbp' },
        //         { label: 'Japanese Yen', value: 'jpy' },
        //         { label: 'Canadian Dollar', value: 'cad' },
        //         { label: 'Australian Dollar', value: 'aud' },
        //         { label: 'Swiss Franc', value: 'chf' },
        //         { label: 'Chinese Yuan', value: 'cny' },
        //         { label: 'Hong Kong Dollar', value: 'hkd' },
        //         { label: 'Singapore Dollar', value: 'sgd' },
        //         { label: 'Mexican Peso', value: 'mxn' },
        //         { label: 'Brazilian Real', value: 'brl' },
        //         { label: 'Russian Ruble', value: 'rub' },
        //         { label: 'South Korean Won', value: 'krw' },
        //         { label: 'South African Rand', value: 'zar' },
        //         { label: 'Turkish Lira', value: 'try' },
        //         { label: 'Saudi Riyal', value: 'sar' },
        //         { label: 'United Arab Emirates Dirham', value: 'aed' },
        //         { label: 'Polish Zloty', value: 'pln' },
        //       ],
        //     },
        //     {
        //       name: 'button',
        //       label: 'Button',
        //       type: 'ui',
        //       admin: {
        //         components: {
        //           Field: {
        //             path: '@contentql/core/client#BeforeDashboard',
        //           },
        //         },
        //       },
        //     },
        //     {
        //       name: 'stripeUserId',
        //       label: 'Stripe Connect Account Id',
        //       type: 'text',
        //       admin: {
        //         description:
        //           'Auto generated by stripe after successful stripe connect',
        //         readOnly: true,
        //       },
        //     },
        //     {
        //       name: 'stripeAdminDashboard',
        //       label: 'Stripe Admin Dashboard',
        //       type: 'text',
        //       admin: {
        //         description:
        //           'Auto generated by stripe after successful stripe connect',
        //         readOnly: true,
        //       },
        //     },
        //   ],
        // },
      ],
    },
  ],
}
