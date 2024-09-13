import { CollectionBeforeChangeHook } from 'payload'

export const assignAdminRoleIfNoAdminsExist: CollectionBeforeChangeHook =
  async ({ data, req, operation, originalDoc }) => {
    if (operation === 'create') {
      const { payload, context } = req

      const { totalDocs: totalUsers } = await payload.count({
        collection: 'users',
        where: {
          role: {
            equals: 'admin',
          },
        },
      })

      if (context.preventRoleOverride) {
        return data
      }

      if (totalUsers === 0) {
        return { ...data, role: 'admin' }
      }

      return data
    }

    return data
  }
