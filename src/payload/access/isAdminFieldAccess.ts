import { FieldAccess } from 'payload'

export const isAdminFieldAccess: FieldAccess = ({ req }) => {
  if (req?.user) {
    const userRole = req.user?.role || []

    return userRole.includes('admin')
  }

  return false
}
