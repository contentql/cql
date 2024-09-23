import type { CustomCollectionConfig } from "../../../core/payload-overrides.js";

import {
  isAdminOrCurrentUser,
  isAdmin,
  adminOrCurrentUserFieldAccess,
} from "../../access/index.js";
import { slugField } from "../../fields/slug/index.js";

import { assignAdminRoleIfNoAdminsExist } from "./hooks/assignAdminRoleIfNoAdminsExist.js";
import { authorAccessAfterUpdate } from "./hooks/authorAccessAfterUpdate.js";
import { collectionSlug } from "../../../core/collectionSlug.js";
import { socialLinksField } from "../../globals/SiteSettings/index.js";

export const Users: CustomCollectionConfig = {
  slug: collectionSlug.users,
  admin: {
    group: "Auth",
    useAsTitle: "email",
  },

  auth: {
    cookies: {
      secure: true,
    },
  },
  hooks: {
    beforeChange: [authorAccessAfterUpdate, assignAdminRoleIfNoAdminsExist],
  },
  access: {
    admin: async ({ req }) => {
      // added author also to access the admin-panel
      if (req.user) {
        const userRole: string[] = req?.user?.role || [];

        const hasAccess = userRole
          .map((role) => ["admin", "author"].includes(role))
          .some(Boolean);
        return hasAccess;
      }

      return false;
    },
    read: isAdminOrCurrentUser,
    create: isAdmin,
    update: isAdmin,
    delete: isAdminOrCurrentUser,
  },
  fields: [
    {
      name: "displayName",
      label: "Display Name",
      type: "text",
      saveToJWT: true,
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
    slugField("username", {
      name: "username",
      label: "Username",
      type: "text",
      saveToJWT: true,
      required: true,
      unique: true,
      admin: {
        readOnly: false,
        position: undefined,
      },
    }),
    {
      name: "imageUrl",
      type: "upload",
      relationTo: "media",
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
    // only admin can update the role field
    {
      name: "role",
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Author",
          value: "author",
        },
        {
          label: "User",
          value: "user",
        },
      ],
      saveToJWT: true,
      defaultValue: "user",
      required: true,
      hasMany: true,
    },
    {
      name: "emailVerified",
      type: "date",
    },
    {
      type: "array",
      name: "socialLinks",
      label: "Social Links",
      fields: [socialLinksField],
    },
  ],
};
