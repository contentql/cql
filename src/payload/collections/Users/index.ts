import { collectionSlug } from '../../../core/collectionSlug.js'
import { adminOrCurrentUserFieldAccess } from '../../access/adminOrCurrentUserFieldAccess.js'
import { isAdmin } from '../../access/isAdmin.js'
import { isAdminFieldAccess } from '../../access/isAdminFieldAccess.js'
import { slugField } from '../../fields/slug/index.js'
import { socialLinksField } from '../../globals/SiteSettings/index.js'
import { AUTH_GROUP } from '../constants.js'
import { CollectionConfig } from 'payload'

import { isAdminOrCurrentUser } from './access/isAdminOrCurrentUser.js'
import { authorAccessAfterUpdate } from './hooks/authorAccessAfterUpdate.js'
import { handleUserRoles } from './hooks/handleUserRoles.js'
import { preventAdminRoleUpdate } from './hooks/preventAdminRoleUpdate.js'

export const Users: CollectionConfig = {
  slug: collectionSlug.users,
  admin: {
    group: AUTH_GROUP,
    useAsTitle: 'email',
  },
  auth: {
    cookies: {
      secure: true,
    },
  },
  hooks: {
    beforeChange: [
      authorAccessAfterUpdate,
      handleUserRoles,
      preventAdminRoleUpdate,
    ],
  },
  access: {
    admin: async ({ req }) => {
      // added author also to access the admin-panel
      if (req.user) {
        const userRole: string[] = req?.user?.role || []

        const hasAccess = userRole.some(role =>
          ['admin', 'author'].includes(role),
        )

        return hasAccess
      }

      return false
    },
    read: () => true,
    create: isAdmin,
    update: isAdminOrCurrentUser,
    delete: isAdminOrCurrentUser,
  },
  fields: [
    {
      name: 'displayName',
      label: 'Display Name',
      type: 'text',
      saveToJWT: true,
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
    slugField({
      fieldToUse: 'username',
      overrides: {
        name: 'username',
        label: 'Username',
        type: 'text',
        saveToJWT: true,
        required: true,
        unique: true,
        admin: {
          readOnly: false,
          position: undefined,
          disableBulkEdit: false,
        },
      },
    }),
    {
      name: 'imageUrl',
      type: 'upload',
      relationTo: 'media',
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
    // only admin can update the role field
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Author',
          value: 'author',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      access: {
        create: isAdminFieldAccess,
        update: isAdminFieldAccess,
      },
      saveToJWT: true,
      defaultValue: 'user',
      required: true,
      hasMany: true,
    },
    {
      name: 'emailVerified',
      type: 'date',
      access: {
        create: isAdminFieldAccess,
        update: isAdminFieldAccess,
      },
    },
    {
      type: 'array',
      name: 'socialLinks',
      label: 'Social Links',
      fields: [socialLinksField],
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
  ],
}
