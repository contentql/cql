import { collectionSlug } from '../../../../core/collectionSlug.js'
import type { CustomCollectionConfig } from '../../../../core/payload-overrides.js'
import { adminOrCurrentUserFieldAccess } from '../../../../payload/access/adminOrCurrentUserFieldAccess.js'
import { isAdmin } from '../../../../payload/access/isAdmin.js'
import { isAdminFieldAccess } from '../../../../payload/access/isAdminFieldAccess.js'
import { isAdminOrCurrentUser } from '../../../../payload/collections/Users/access/isAdminOrCurrentUser.js'
import { handleUserRoles } from '../../../../payload/collections/Users/hooks/handleUserRoles.js'
import { preventAdminRoleUpdate } from '../../../../payload/collections/Users/hooks/preventAdminRoleUpdate.js'
import { AUTH_GROUP } from '../../../../payload/collections/constants.js'
import { slugField } from '../../../../payload/fields/slug/index.js'

export const Users: CustomCollectionConfig = {
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
    beforeChange: [handleUserRoles, preventAdminRoleUpdate],
  },
  access: {
    admin: async ({ req }) => {
      // added author also to access the admin-panel
      if (req.user) {
        const userRole: string[] = req?.user?.role || []

        const hasAccess = userRole.some(role => ['admin'].includes(role))

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
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Waiter',
          value: 'waiter',
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
  ],
}
