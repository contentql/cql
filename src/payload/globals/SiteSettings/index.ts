import { revalidateTag } from "next/cache.js";
import { z } from "zod";
import {
  CustomGlobalConfig,
  CustomField,
} from "../../../core/payload-overrides.js";

import { collectionSlug } from "../../../core/collectionSlug.js";
import { isAdmin } from "../../access/index.js";

const validateURL = z
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
  .url();

const menuItem: CustomField[] = [
  {
    type: "row",
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "type",
            type: "radio",
            admin: {
              layout: "horizontal",
              width: "50%",
            },
            defaultValue: "reference",
            options: [
              {
                label: "Internal link",
                value: "reference",
              },
              {
                label: "Custom URL",
                value: "custom",
              },
            ],
          },
          {
            name: "newTab",
            type: "checkbox",
            admin: {
              style: {
                alignSelf: "flex-end",
              },
              width: "50%",
            },
            label: "Open in new tab",
          },
        ],
      },
    ],
  },
  {
    type: "row",
    fields: [
      {
        name: "label",
        type: "text",
        label: "Label",
        required: true,
      },
      {
        type: "relationship",
        name: "page",
        relationTo: ["pages"],
        admin: {
          condition: (_data, siblingData) => {
            return siblingData.type === "reference";
          },
        },
        required: true,
        maxDepth: 1,
      },
      {
        name: "url",
        type: "text",
        label: "URL",
        admin: {
          condition: (_data, siblingData) => siblingData.type === "custom",
        },
        validate: (value) => {
          const { success } = validateURL.safeParse(value);
          return success || "Link is not valid";
        },
        required: true,
      },
    ],
  },
];

const menuGroupItem: CustomField = {
  type: "group",
  name: "menuLinkGroup",
  label: "Link Group",
  fields: [
    {
      type: "text",
      name: "groupTitle",
      label: "Group Title",
      required: true,
    },
    {
      type: "array",
      name: "groupLinks",
      label: "Links",
      fields: menuItem,
    },
  ],
  admin: {
    condition: (_data, siblingData) => siblingData.group,
  },
};

const menuField: CustomField[] = [
  {
    type: "checkbox",
    name: "group",
    label: "Group",
    defaultValue: false,
    admin: {
      description: "Check to create group of links",
    },
  },
  {
    name: "menuLink",
    type: "group",
    label: "Link",
    fields: menuItem,
    admin: {
      condition: (_data, siblingData) => !siblingData.group,
    },
  },
  menuGroupItem,
];

const logoField: CustomField[] = [
  {
    name: "imageUrl",
    type: "upload",
    required: true,
    relationTo: "media",
    label: "Image",
  },
  {
    type: "row",
    fields: [
      {
        label: "Height",
        name: "height",
        type: "number",
        admin: {
          description: "Adjust to the height of the logo",
        },
      },
      {
        label: "Width",
        name: "width",
        type: "number",
        admin: {
          description: "Adjust to the width of the logo",
        },
      },
    ],
  },
];

export const socialLinksField: CustomField = {
  type: "row",
  fields: [
    {
      type: "select",
      name: "platform",
      label: "Platform",
      required: true,
      options: [
        {
          label: "Facebook",
          value: "facebook",
        },
        {
          label: "Instagram",
          value: "instagram",
        },
        {
          label: "Twitter",
          value: "twitter",
        },
        {
          label: "LinkedIn",
          value: "linkedin",
        },
        {
          label: "YouTube",
          value: "youtube",
        },
        {
          label: "TikTok",
          value: "tiktok",
        },
        {
          label: "Pinterest",
          value: "pinterest",
        },
        {
          label: "Snapchat",
          value: "snapchat",
        },
        {
          label: "Reddit",
          value: "reddit",
        },
        {
          label: "Tumblr",
          value: "tumblr",
        },
        {
          label: "WhatsApp",
          value: "whatsapp",
        },
        {
          label: "Telegram",
          value: "telegram",
        },
        {
          label: "GitHub",
          value: "github",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Quora",
          value: "quora",
        },
        {
          label: "Discord",
          value: "discord",
        },
      ],
    },
    {
      type: "text",
      name: "value",
      label: "Link",
      required: true,
      validate: (value, args) => {
        const { success } = validateURL.safeParse(value);

        return success || "Link is not valid";
      },
    },
  ],
};

export const siteSettings: CustomGlobalConfig = {
  slug: collectionSlug["site-settings"],
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  hooks: {
    afterChange: [async () => revalidateTag("site-settings")],
  },
  fields: [
    {
      type: "tabs",
      label: "Settings",
      tabs: [
        {
          label: "General",
          name: "general",
          fields: [
            { type: "text", name: "title", required: true },
            {
              type: "textarea",
              name: "description",
              required: true,
            },
            {
              name: "faviconUrl",
              type: "upload",
              required: true,
              relationTo: "media",
              label: "Favicon",
              admin: {
                description: "We recommend a maximum size of 256 * 256 pixels",
              },
            },
            {
              name: "ogImageUrl",
              type: "upload",
              required: true,
              relationTo: "media",
              label: "OG Image",
              admin: {
                description: "We recommend a maximum size of 1200 * 630 pixels",
              },
            },
            {
              name: "keywords",
              type: "text",
              hasMany: true,
            },
          ],
        },
        {
          label: "Navbar",
          name: "navbar",
          fields: [
            {
              name: "logo",
              type: "group",
              interfaceName: "BrandLogo", // optional
              label: "Logo",
              fields: logoField,
            },
            {
              name: "menuLinks",
              label: "Menu Links",
              type: "array",
              fields: menuField,
            },
          ],
        },
        {
          label: "Footer",
          name: "footer",
          fields: [
            {
              name: "logo",
              type: "group",
              interfaceName: "BrandLogo", // optional
              label: "Logo",
              fields: [
                ...logoField,
                {
                  type: "text",
                  label: "Description",
                  name: "description",
                  admin: {
                    description: "This text appears below the footer image",
                  },
                },
              ],
            },
            {
              name: "footerLinks",
              type: "array",
              label: "Footer Links",
              fields: menuField,
            },
            {
              type: "array",
              name: "socialLinks",
              label: "Social Links",
              fields: [socialLinksField],
            },
            { type: "text", name: "copyright", label: "Copyright" },
          ],
        },
      ],
    },
  ],
};
