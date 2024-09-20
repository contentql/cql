import type { Block, CollectionConfig } from "payload";

import { layoutField } from "../../fields/layout/index.js";
import { pathField, pathModeField } from "../../fields/path/index.js";
import { slugField, slugModeField } from "../../fields/slug/index.js";
import homeBlockConfig from "../../blocks/homeBlockConfig.js";
import { collectionSlug } from "../../../core/collectionSlug.js";
import { isAdmin } from "../../access/index.js";

type BlocksType = {
  blocks?: Block[];
};

export const Pages = ({ blocks = [] }: BlocksType): CollectionConfig => {
  return {
    slug: collectionSlug.pages,
    labels: {
      singular: "Page",
      plural: "Pages",
    },
    access: {
      read: isAdmin,
      update: isAdmin,
      create: isAdmin,
      delete: isAdmin,
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
      layoutField({ blocks: blocks.length ? blocks : [homeBlockConfig] }),
      slugModeField(),
      slugField("title"),
      pathModeField(),
      pathField(),
    ],
  };
};
