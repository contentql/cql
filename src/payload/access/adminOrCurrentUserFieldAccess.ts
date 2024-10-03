import { FieldAccess } from 'payload'

export const adminOrCurrentUserFieldAccess: FieldAccess = ({ req }) => {
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
