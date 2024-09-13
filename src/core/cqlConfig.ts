import { type Config as PayloadConfig } from "payload";
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

const cqlConfig = ({
  dbURL = "mongodb://localhost:27017/defaultDB",
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
}: CQLConfigType): PayloadConfig => {
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

  return {
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
  };
};

export default cqlConfig;
