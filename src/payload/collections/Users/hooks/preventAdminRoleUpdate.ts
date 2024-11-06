import { APIError, CollectionBeforeChangeHook } from 'payload'

export const preventAdminRoleUpdate: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation === 'update' && data?.role && originalDoc?.role) {
    const { totalDocs: adminCount, docs: admins } = await req.payload.find({
      collection: 'users',
      where: {
        role: {
          contains: 'admin',
        },
      },
    })
    if (
      adminCount === 1 &&
      admins.find(admin => admin.email === data.email) &&
      !data?.role?.includes('admin')
    ) {
      const error = new APIError(
        'At least one admin must exist. Role update denied.',
        400,
        [
          {
            field: 'role',
            message: 'This will remove whole access to the admin panel.',
          },
        ],
        false,
      )
      throw error
    }
  }

  return data
}
