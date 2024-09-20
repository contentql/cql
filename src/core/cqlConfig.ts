import { type Config as PayloadConfig, buildConfig, type Block } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { s3Storage } from "@payloadcms/storage-s3";
import { slateEditor } from "@payloadcms/richtext-slate";
import { resendAdapter } from "@payloadcms/email-resend";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { searchPlugin } from "@payloadcms/plugin-search";
import type { SearchPluginConfig } from "@payloadcms/plugin-search/dist/types.js";

import { seoPlugin } from "@payloadcms/plugin-seo";
import { generateBreadcrumbsUrl } from "../utils/generateBreadcrumbsUrl.js";

import { Blogs } from "../payload/collections/Blogs/index.js";
import { Media } from "../payload/collections/Media/index.js";
import { Pages } from "../payload/collections/Pages/index.js";
import { Tags } from "../payload/collections/Tags/index.js";
import { Users } from "../payload/collections/Users/index.js";
import { siteSettings } from "../payload/globals/SiteSettings/index.js";
import { collectionSlug } from "./collectionSlug.js";
import scheduleDocPlugin from "../payload/plugins/scheduleDocPlugin.js";

// added sharp as peer dependencies because nextjs-image recommends to install it
import sharp from "sharp";
import { PluginTypes } from "../payload/fields/publish/types.js";
import {
  generateURL,
  generateTitle,
  generateImage,
  generateDescription,
} from "../utils/seo.js";
import { BeforeSyncConfig } from "../utils/beforeSync.js";
import { isAdmin } from "../payload/access/index.js";

type S3Type = {
  bucket: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

type ResendType = {
  defaultFromAddress: string;
  defaultFromName: string;
  apiKey: string;
};

export interface CQLConfigType extends Partial<PayloadConfig> {
  dbURL: string;
  baseURL: string;
  s3?: S3Type;
  resend?: ResendType;
  blocks?: Block[];
  schedulePluginOptions?: PluginTypes;
  searchPluginOptions?: SearchPluginConfig;
}

/**
 * Configures and builds a ContentQL configuration object.
 * This function extends the Payload CMS configuration by providing default collections
 * and you can pass all parameters that Payload config accepts.
 *
 * @example
 * // This is an example of a cql configuration
 * // By default if dbURL is not specified then the default will 'default-db'
 * // Default payload secret key is 'TESTING'
 * export default cqlConfig({
 *   dbURL: "mongodb://mydb:27017/default-db",
 *   s3: {
 *     bucket: "my-bucket",
 *     accessKeyId: "ACCESS_KEY",
 *     secretAccessKey: "SECRET_KEY",
 *     region: "us-west-2",
 *     endpoint: "https://s3.amazonaws.com"
 *   },
 *   resend: {
 *     apiKey: "RESEND_API_KEY",
 *     defaultFromAddress: "noreply@example.com",
 *     defaultFromName: "My App"
 *   }
 * // baseURL is required for Live-Preview & SEO generation
 *   baseUrl: "http://localhost:3000"
 * });
 */

const cqlConfig = ({
  dbURL = "mongodb://localhost:27017/default-db",
  baseURL = "http://localhost:3000",
  cors = ["http://localhost:3000"],
  csrf = ["http://localhost:3000"],
  s3,
  admin = {},
  secret = "TESTING",
  editor = slateEditor({}),
  collections = [],
  globals = [],
  resend,
  blocks,
  schedulePluginOptions = {
    enabled: true,
    collections: [collectionSlug["blogs"]],
    position: "sidebar",
  },
  searchPluginOptions = {},
  email,
  ...config
}: CQLConfigType) => {
  const plugins: CQLConfigType["plugins"] = config.plugins || [];

  if (s3) {
    const { bucket, accessKeyId, endpoint, region, secretAccessKey } = s3;

    plugins.push(
      s3Storage({
        collections: {
          ["media"]: true,
        },
        bucket,
        config: {
          endpoint,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          region,
        },
      })
    );
  }

  const defaultCollections = [Users, Tags, Blogs, Media, Pages({ blocks })];

  if (collections.length) {
    // mapping through user collections
    collections.forEach((collection) => {
      // need to implement deepMerge functionality for now skipping with console warning
      if (collection.slug in collectionSlug) {
        console.warn(
          `${collection.slug} collection already exists, skipping collection mapping`
        );
      }
      // else pushing the user collection to default collection
      else {
        defaultCollections.push(collection);
      }
    });
  }

  return buildConfig({
    ...config,
    admin: {
      ...admin,
      user: Users.slug,
      meta: {
        titleSuffix: "- ContentQL",
        ...(admin.meta || {}),
      },
      livePreview: {
        url: ({ data, collectionConfig, locale }) => {
          return `${baseURL}/${data.path}${
            locale ? `?locale=${locale.code}` : ""
          }`;
        },

        collections: [collectionSlug["blogs"], collectionSlug["pages"]],

        breakpoints: [
          {
            label: "Mobile",
            name: "mobile",
            width: 375,
            height: 667,
          },
          {
            label: "Tablet",
            name: "tablet",
            width: 768,
            height: 1024,
          },
          {
            label: "Desktop",
            name: "desktop",
            width: 1440,
            height: 900,
          },
        ],

        ...(admin.livePreview || {}),
      },
    },
    collections: defaultCollections,
    globals: [siteSettings, ...globals],
    db: mongooseAdapter({
      url: dbURL,
    }),
    secret,
    plugins: [
      ...plugins,
      nestedDocsPlugin({
        collections: [collectionSlug["pages"]],
        generateURL: generateBreadcrumbsUrl,
      }),
      // this is for scheduling document publish
      scheduleDocPlugin(schedulePluginOptions),
      // this plugin generates metadata field for every page created
      seoPlugin({
        collections: [collectionSlug["pages"]],
        uploadsCollection: "media",
        tabbedUI: true,
        generateURL: (data) => generateURL({ data, baseURL }),
        generateTitle,
        generateDescription,
        generateImage,
      }),
      // this plugin is for global search across the defined collections
      searchPlugin({
        collections: [
          collectionSlug["blogs"],
          collectionSlug["tags"],
          collectionSlug["users"],
        ],
        defaultPriorities: {
          [collectionSlug["blogs"]]: 10,
          [collectionSlug["tags"]]: 20,
          [collectionSlug["users"]]: 30,
        },
        beforeSync: BeforeSyncConfig,
        searchOverrides: {
          access: {
            read: isAdmin,
          },
        },
        ...searchPluginOptions,
      }),
    ],
    cors,
    csrf,
    editor,
    sharp,
    email: resend
      ? resendAdapter({
          apiKey: resend.apiKey,
          defaultFromAddress: resend.defaultFromAddress,
          defaultFromName: resend.defaultFromName,
        })
      : email,
  });
};

export default cqlConfig;
