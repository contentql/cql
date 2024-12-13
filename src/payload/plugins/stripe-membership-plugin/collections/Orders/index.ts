import { ADMIN_STRIPE_GROUP } from '../constants'
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: ADMIN_STRIPE_GROUP,
  },
  labels: {
    singular: 'order',
    plural: 'Orders',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Amount',
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Currency',
    },
    {
      name: 'status',
      type: 'text',
      label: 'Payment Status',
    },
    {
      name: 'invoiceId',
      type: 'text',
      label: 'Invoice Id',
    },
    {
      name: 'invoiceUrl',
      type: 'text',
      label: 'Invoice Url',
    },
    {
      name: 'invoicePdf',
      type: 'text',
      label: 'Invoice Pdf',
    },
    {
      name: 'products',
      label: 'Products',
      type: 'json',
    },
    {
      name: 'userEmail',
      type: 'email',
      label: 'User Email',
    },
    {
      name: 'paymentError',
      type: 'text',
      label: 'Error message',
    },
  ],
}
