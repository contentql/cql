import type { CollectionConfig, Field } from "payload";
import { collectionSlug } from "../../../core/collectionSlug.js";
import { isAdminOrCurrentUser, isAdminOrAuthor } from "../../access/index.js";

const urlField: Field = {
  name: "url",
  type: "text",
};

export const Media: CollectionConfig = {
  slug: collectionSlug.media,
  access: {
    read: () => true,
    update: isAdminOrCurrentUser,
    delete: isAdminOrCurrentUser,
    create: isAdminOrAuthor,
  },
  upload: {
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "blogImageSize2",
        width: 986,
        height: undefined,
        position: "centre",
      },
      {
        name: "blogImageSize3",
        width: 1470,
        height: undefined,
        position: "centre",
      },
    ],
    focalPoint: false,
    crop: false,
  },
  fields: [
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
    },
    // The following fields should be able to be merged in to default upload fields
    urlField,
    {
      name: "sizes",
      type: "group",
      fields: [
        {
          name: "square",
          type: "group",
          fields: [urlField],
        },
      ],
    },
  ],
};
