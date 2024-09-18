import type { CollectionConfig } from "payload";

import { slugField } from "../../fields/slug/index.js";
import { collectionSlug } from "../../../core/collectionSlug.js";

export const Tags: CollectionConfig = {
  slug: collectionSlug.tags,
  labels: {
    singular: "Tag",
    plural: "Tags",
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "path", "updatedAt", "createdAt"],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 10,
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "tagImage",
      label: "Tag Image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "upload tag image",
      },
    },
    slugField("title"),
    {
      name: "color",
      label: "Tag Color",
      type: "select",
      defaultValue: "blue",
      options: [
        { label: "Blue", value: "blue" },
        { label: "Gray", value: "gray" },
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Yellow", value: "yellow" },
        { label: "Indigo", value: "indigo" },
        { label: "Purple", value: "purple" },
        { label: "Pink", value: "pink" },
      ],
    },
  ],
};
