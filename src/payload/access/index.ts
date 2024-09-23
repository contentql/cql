import { Access, FieldAccess } from "payload";

export const isAdmin: Access = ({ req }) => {
  if (req.user) {
    const userRole = req?.user?.role || [];

    return userRole.includes("admin");
  }

  return false;
};

export const isAdminOrCurrentUser: Access = ({ req }) => {
  if (req.user) {
    const userRole = req?.user?.role || [];

    if (userRole.includes("admin")) {
      return true;
    }

    return { id: { equals: req.user?.id } };
  }

  return false;
};

// this is permission check for admin or author
export const isAdminOrAuthor: Access = ({ req }) => {
  // if user is present checking the role
  if (req?.user) {
    const userRole: string[] = req?.user?.role || [];

    const hasAccess = userRole
      .map((role) => ["admin", "author"].includes(role))
      .some(Boolean);
    return hasAccess;
  }

  return false;
};

export const adminOrCurrentUserFieldAccess: FieldAccess = ({ req }) => {
  // if user is present checking the role
  if (req?.user) {
    const userRole: string[] = req?.user?.role || [];

    const hasAccess = userRole
      .map((role) => ["admin", "author"].includes(role))
      .some(Boolean);
    return hasAccess;
  }

  return false;
};
