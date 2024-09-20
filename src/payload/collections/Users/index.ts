import type { CollectionConfig } from "payload";

import {
  isAdminOrCurrentUser,
  isAdmin,
  adminOrCurrentUserFieldAccess,
} from "../../access/index.js";
import { slugField } from "../../fields/slug/index.js";

import { assignAdminRoleIfNoAdminsExist } from "./hooks/assignAdminRoleIfNoAdminsExist.js";
import { authorAccessAfterUpdate } from "./hooks/authorAccessAfterUpdate.js";
import { collectionSlug } from "../../../core/collectionSlug.js";

export const Users: CollectionConfig = {
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
      return ["admin", "author"].includes(req?.user?.role || "user");
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
      options: ["admin", "user", "author"],
      saveToJWT: true,
      defaultValue: "user",
      required: true,
    },
    {
      name: "emailVerified",
      type: "date",
    },
  ],
} as const;
