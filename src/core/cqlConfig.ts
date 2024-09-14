import { type Config as PayloadConfig, buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { s3Storage } from "@payloadcms/storage-s3";
import { slateEditor } from "@payloadcms/richtext-slate";
import { resendAdapter } from "@payloadcms/email-resend";

import { Blogs } from "../payload/collections/Blogs/index.js";
import { Media } from "../payload/collections/Media/index.js";
import { Pages } from "../payload/collections/Pages/index.js";
import { Tags } from "../payload/collections/Tags/index.js";
import { Users } from "../payload/collections/Users/index.js";
import { siteSettings } from "../payload/globals/SiteSettings/index.js";

// added sharp as peer dependencies because nextjs-image recommends to install it
import sharp from "sharp";

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
  s3?: S3Type;
  resend?: ResendType;
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
 * });
 */

const cqlConfig = ({
  dbURL = "mongodb://localhost:27017/default-db",
  cors = ["http://localhost:3000"],
  csrf = ["http://localhost:3000"],
  s3,
  admin = {},
  secret = "TESTING",
  editor = slateEditor({}),
  collections = [],
  globals = [],
  resend,
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

  return buildConfig({
    ...config,
    admin: {
      ...admin,
      user: Users.slug,
      meta: {
        titleSuffix: "- ContentQL",
        ...(admin.meta || {}),
      },
    },
    collections: [Users, Tags, Blogs, Media, Pages, ...collections],
    globals: [siteSettings, ...globals],
    db: mongooseAdapter({
      url: dbURL,
    }),
    secret,
    plugins,
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
      : undefined,
  });
};

export default cqlConfig;
