import { Access, FieldAccess } from "payload";

export const isAdmin: Access = ({ req }) => {
  return req?.user?.role === "admin";
};

export const isAdminOrCurrentUser: Access = ({ req }) => {
  if (req?.user?.role === "admin") return true;
  return { id: { equals: req.user?.id } };
};

// this is permission check for admin or author
export const isAdminOrAuthor: Access = ({ req }) => {
  // if user is present checking the role
  if (req?.user) {
    return Boolean(["admin", "author"].includes(req?.user?.role || "user"));
  }

  // else returning the false
  return false;
};

export const adminOrCurrentUserFieldAccess: FieldAccess = ({ req }) => {
  if (req?.user) {
    return Boolean(["admin", "author"].includes(req?.user?.role));
  }

  return false;
};
