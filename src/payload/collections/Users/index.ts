import { collectionSlug } from '../../../core/collectionSlug.js'
import type { CustomCollectionConfig } from '../../../core/payload-overrides.js'
import { adminOrCurrentUserFieldAccess } from '../../access/adminOrCurrentUserFieldAccess.js'
import { slugField } from '../../fields/slug/index.js'
import { socialLinksField } from '../../globals/SiteSettings/index.js'
import { AUTH_GROUP } from '../constants.js'

import { isAdminOrCurrentUser } from './access/isAdminOrCurrentUser.js'
import { authorAccessAfterUpdate } from './hooks/authorAccessAfterUpdate.js'
import { handleUserRoles } from './hooks/handleUserRoles.js'

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
    beforeChange: [authorAccessAfterUpdate, handleUserRoles],
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
    read: isAdminOrCurrentUser,
    create: () => true,
    update: isAdminOrCurrentUser,
    delete: isAdminOrCurrentUser,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'User',
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
              saveToJWT: true,
              defaultValue: 'user',
              required: true,
              hasMany: true,
            },
            {
              name: 'emailVerified',
              type: 'date',
            },
            {
              type: 'array',
              name: 'socialLinks',
              label: 'Social Links',
              fields: [socialLinksField],
            },
          ],
        },
      ],
    },
  ],
}
