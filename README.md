# ContentQL Core

`@contentql/core` gives configuration which is ready to build a
**content-oriented, blog website, restaurant website** you can add this to your
payload existing project.

<a href="https://www.npmjs.com/package/@contentql/core"><img alt="npm" src="https://img.shields.io/npm/v/@contentql/core?style=flat-square" /></a>

## Getting Started

**Example Usage**

Add this code in your `payload.config.ts` file to get a base configuration

```ts
import { cqlConfig } from '@contentql/core'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

// payload block-configuration files
import DetailsConfig from '@/payload/blocks/Details/config'
import HomeConfig from '@/payload/blocks/Home/config'
import ListConfig from '@/payload/blocks/List/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const finalPath = path.resolve(dirname, 'payload-types.ts')

// Add the extra payload configuration you want!
export default cqlConfig({
  // baseURL is required for Live-Preview & SEO generation
  baseUrl: 'http://localhost:3000',
  db: process.env.DATABASE_URI,
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
})
```

## Theme Configuration

By default `@contentql/core` supports Blog, Restaurant website configuration

**Blog Configuration**

- To use blog-configuration do this👇

```ts
// payload.config.ts file
// You'll get blog-configuration
import { cqlConfig } from '@contentql/core'
```

- These collections are defaultly added <mark>users, pages, blogs, tags, media,
  site-settings</mark> for blog-configuration

**Restaurant Configuration**

- To use restaurant-configuration do this👇

```ts
// payload.config.ts file
// You'll get restaurant-configuration
import { cqlConfig } from '@contentql/core/restaurant'
```

- These collections are defaultly added <mark>users, pages, media,
  site-settings, categories, foodItems</mark> for restaurant-configuration

## 🔋️Database Adapter

- By default `SQLlite` database is used, if no db parameter is passed data will
  be stored in `/data/payload.db` directory
- `@contentql/core` package by default comes with all offical payload
  database-adapters
  - @payloadcms/db-mongodb
  - @payloadcms/db-postgres
  - @payloadcms/db-sqlite
  - @payloadcms/db-vercel-postgres
- based on the `dbURI` adapter will be automatically picked, example👇

```typescript
// @payloadcms/db-mongodb adapter will be used
export default cqlConfig({
  dbURI: 'mongodb://127.0.0.1/bolt-theme',
})

// @payloadcms/db-postgres adapter will be used
export default cqlConfig({
  dbURI: 'postgres://username:password@host:port/database',
})

// @payloadcms/db-vercel-postgres adapter will be used
export default cqlConfig({
  dbURI: 'postgres://username:password@host:port/database',
  useVercelPostgresAdapter: true, // pass true to use @payloadcms/db-vercel-postgres adapter
})

// @payloadcms/db-sqlite adapter will be used
// Note for sqlLite adapater by-default we use databaseURL ase file:./data/payload.db
// dbURI will be used as sync-url
// if you want to opt-out of this behaviour pass syncDB as false
export default cqlConfig({
  dbURI: 'libsql://bolt-random.turso.io',
  dbSecret: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9',
})
```

- You can pass your own adapter with custom-configuration, thats still supported

```typescript
export default cqlConfig({
  // attach your own database adapter
  db: sqliteAdapter({
    client: {
      url: env.DATABASE_URI,
      authToken: env.DATABASE_SECRET,
    },
  }),
})
```

**Slug Access**

You can access the slugs of collections by using this import

```ts
// This will provide the slugs of all collections
import { collectionSlug } from '@contentql/core'

const { docs } = await payload.find({
  collection: collectionSlug['blogs'],
  depth: 5,
  draft: false,
})
```

**Removing Collections**

You can remove the collections which are not required for you

```ts
export default cqlConfig({
  // whatever collection-slug passed in removeCollections or removeGlobals will be removed
  removeCollections: ['blogs'],
  removeGlobals: ['site-settings'],
})
```

Note: You can't remove the `users` collection, you can only extend users
collection with custom-fields

## 📦Out of box contents

**Plugins**

These plugins will be automatically added

- `@payloadcms/plugin-nested-docs`, `@payloadcms/plugin-seo`
  - These plugins are enabled for `pages` collection
- `scheduleDocPlugin`
  - This is our custom plugin which will provide an option to schedule the
    publish of a document
  - It's enabled to `blogs` collection you can extend it but passing your own
    options in `schedulePluginOptions` parameter in `cqlConfig`
- `@payloadcms/plugin-search`
  - Search plugin is by-default enabled for blogs, tags, users collections
  - you can extend it by passing your own options in `searchPluginOptions`
    parameter in `cqlConfig`
- `@payloadcms/plugin-form-builder`
  - Form builder is enabled default, It's supports `upload field`
  - you can extend it by passing your own options in `formBuilderPluginOptions`
    parameter in cqlConfig

## 📔Note

- You can add new fields to the existing Collections or Globals but can't modify
  existing fields
- radio, select field-type accept options parameter as `OptionObject[]`, we
  added this to support the merging of configuration

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

## 💅Admin Panel styling

```ts
// Add this import in the layout.tsx or page.tsx of payload admin panel
import '@contentql/core/styles'
```
