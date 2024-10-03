import { Access } from 'payload'

export const isAdmin: Access = ({ req }) => {
  if (req.user) {
    const userRole = req?.user?.role || []

    return userRole.includes('admin')
  }

  return false
}
