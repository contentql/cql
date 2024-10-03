import { Access } from 'payload'

// this is permission check for admin or author
export const isAdminOrAuthor: Access = ({ req }) => {
  // if user is present checking the role
  if (req?.user) {
    const userRole: string[] = req?.user?.role || []

    const hasAccess = userRole
      .map(role => ['admin', 'author'].includes(role))
      .some(Boolean)
    return hasAccess
  }

  return false
}
