import type { CollectionConfig } from "payload";

import { slugField } from "../../fields/slug/index.js";

import { assignUserId } from "./field-level-hooks/assignUserId.js";

export const Blogs: CollectionConfig = {
  slug: "blogs",
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
      name: "selectBlogSize",
      type: "select",
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
      },
      defaultValue: "1",
      options: [
        {
          label: "One",
          value: "1",
        },
        {
          label: "Two",
          value: "2",
        },
      ],
    },

    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    slugField("title"),
    {
      name: "tags",
      label: "Tags",
      type: "relationship",
      relationTo: ["tags"],
      hasMany: true,
    },
    {
      name: "subTitle",
      label: "Sub Title",
      type: "text",
      required: true,
    },
    {
      name: "blogImage",
      label: "Blog Image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "upload blog image",
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
  ],
};
