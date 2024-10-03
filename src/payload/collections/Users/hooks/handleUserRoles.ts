import { CollectionBeforeChangeHook } from 'payload'

export const handleUserRoles: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  const { payload } = req

  if (operation === 'create') {
    const { totalDocs: totalUsers } = await payload.count({
      collection: 'users',
      where: {
        role: {
          equals: 'admin',
        },
      },
    })

    if (totalUsers === 0) {
      return { ...data, role: ['admin'] }
    }
  }

  if (data.role?.includes('admin')) {
    const formattedRoles = (data.role || []).filter(
      (role: string) => role !== 'admin',
    )

    return {
      ...data,
      role: formattedRoles.length === 0 ? ['user'] : formattedRoles,
    }
  }

  return data
}
