import { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req, data }) => {
  const { user } = req

  if (user) {
    if (user?.role?.includes('admin')) {
      return true
    }

    return {
      'author.value': {
        equals: user?.id,
      },
    }
  }

  return false
}
