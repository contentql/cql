import { Access } from 'payload'

export const isAdminOrCurrentUser: Access = ({ req }) => {
  if (req.user) {
    const userRole = req?.user?.role || []

    if (userRole.includes('admin')) {
      return true
    }

    return { id: { equals: req.user?.id } }
  }

  return false
}
