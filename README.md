# ContentQL Core

`@contentql/core` gives configuration which is ready to build a **content-oriented, blog website** you can add this to your payload existing project.

<a href="https://www.npmjs.com/package/@contentql/core"><img alt="npm" src="https://img.shields.io/npm/v/@contentql/core?style=flat-square" /></a>

## Getting Started

**Example Usage**

Add this code in your `payload.config.ts` file to get a base configuration

```ts
import path from "path";
import { fileURLToPath } from "url";
import { cqlConfig } from "@contentql/core";

// payload block-configuration files
import DetailsConfig from "@/payload/blocks/Details/config";
import HomeConfig from "@/payload/blocks/Home/config";
import ListConfig from "@/payload/blocks/List/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const finalPath = path.resolve(dirname, "payload-types.ts");

// Add the extra payload configuration you want!
export default cqlConfig({
  // baseURL is required for Live-Preview & SEO generation
  baseUrl: "http://localhost:3000",
  dbURL: process.env.DATABASE_URI,
  s3: {
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
  },
  typescript: {
    outputFile: finalPath,
  },
  secret: process.env.PAYLOAD_SECRET,
  cors: [process.env.PAYLOAD_URL],
  csrf: [process.env.PAYLOAD_URL],
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    defaultFromAddress: process.env.RESEND_SENDER_EMAIL,
    defaultFromName: process.env.RESEND_SENDER_NAME,
  },
  // pass the configuration to blocks field these will appear in pages collection in admin panel
  blocks: [HomeConfig, DetailsConfig, ListConfig],
});
```

**Slug Access**

You can access the slugs of collections by using this import

```ts
// This will provide the slugs of all collections
import { collectionSlug } from "@contentql/core";

const { docs } = await payload.find({
  collection: collectionSlug["blogs"],
  depth: 5,
  draft: false,
});
```

## 📦Out of box contents

**Collections**

These collections will be automatically added

- users
- pages
- blogs
- tags
- media
- site-settings

**Plugins**

These plugins will be automatically added

- `@payloadcms/plugin-nested-docs`, `@payloadcms/plugin-seo`
  - These plugins are enabled for `pages` collection
- `scheduleDocPlugin`
  - This is our custom plugin which will provide an option to schedule the publish of a document
  - It's enabled to `blogs` collection you can extend it but passing your own options in `schedulePluginOptions` parameter in `cqlConfig`
- `@payloadcms/plugin-search`
  - Search plugin is by-default enabled for blogs, tags, users collections
  - you can extend it by passing your own options in `searchPluginOptions` parameter in `cqlConfig`

## 📔Note

- You can add new fields to the existing Collections or Globals but can't modify existing fields
- radio, select field-type accept options parameter as `OptionObject[]`, we added this to support the merging of configuration

```ts
 {
      name: "role",
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Author",
          value: "author",
        },
        {
          label: "User",
          value: "user",
        },
        // editor -> ️️string is not allowed
      ],
      saveToJWT: true,
      defaultValue: "user",
      required: true,
    },
```
