import type { CollectionConfig } from "payload";

import { slugField } from "../../fields/slug/index.js";

import { assignUserId } from "./field-level-hooks/assignUserId.js";
import { collectionSlug } from "../../../core/collectionSlug.js";

export const Blogs: CollectionConfig = {
  slug: collectionSlug.blogs,
  labels: {
    singular: "Blog",
    plural: "Blogs",
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "blogImage",
      label: "Blog Image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Upload blog image",
      },
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "subTitle",
      label: "Sub Title",
      type: "textarea",
      required: true,
      admin: {
        description: "Add the summary of the blog post",
      },
    },
    {
      name: "tags",
      label: "Tags",
      type: "relationship",
      relationTo: ["tags"],
      hasMany: true,
    },
    {
      name: "author",
      type: "relationship",
      label: "Author",
      relationTo: ["users"],
      hasMany: true,
      hooks: {
        beforeChange: [assignUserId],
      },
      filterOptions: ({ relationTo, data }) => {
        if (relationTo === "users") {
          return {
            role: {
              equals: "author",
            },
          };
        } else {
          return false;
        }
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Content",
      required: true,
      admin: {
        description:
          "Main content of the blog post. Use the rich text editor for formatting.",
      },
    },
    slugField("title"),
  ],
};
