import type { CollectionConfig } from "payload";

import { COLLECTION_SLUG_PAGE } from "../constants.js";
import { layoutField } from "../../fields/layout/index.js";
import { pathField, pathModeField } from "../../fields/path/index.js";
import { slugField, slugModeField } from "../../fields/slug/index.js";
import homeBlockConfig from "../../blocks/homeBlockConfig.js";

export const Pages: CollectionConfig = {
  slug: COLLECTION_SLUG_PAGE,
  labels: {
    singular: "Page",
    plural: "Pages",
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
      type: "text",
      required: true,
      unique: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "isHome",
          label: "Home Page",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "isDynamic",
          label: "Dynamic Page",
          type: "checkbox",
          defaultValue: false,
        },
      ],
      admin: {
        position: "sidebar",
      },
    },
    layoutField({ blocks: [homeBlockConfig] }),
    slugModeField(),
    slugField("title"),
    pathModeField(),
    pathField(),
  ],
};
