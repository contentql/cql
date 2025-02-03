import { resendAdapter } from '@payloadcms/email-resend'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload'

import { collectionSlug } from './collectionSlug.js'
import { CQLConfigType } from './cqlConfig.js'
import { db } from './databaseAdapter.js'
import { defaultPlugins } from './defaultPlugins.js'

const getWhitelistDomains = (domains: string[]) => {
  const railwayDomain = '.up.railway.app'
  const contentqlDomain = '.contentql.io'

  return domains
    .map(domain => {
      let clonedDomain = domain

      if (clonedDomain.includes(railwayDomain)) {
        return [domain, clonedDomain.replace(railwayDomain, contentqlDomain)]
      }

      return [domain]
    })
    .flat()
}

export default function baseConfig({
  baseURL = 'http://localhost:3000',
  cors = ['http://localhost:3000'],
  csrf = ['http://localhost:3000'],
  admin = {},
  secret = 'TESTING',
  editor = slateEditor({}),
  collections = [],
  globals = [],
  resend,
  email,
  dbURI,
  dbSecret,
  db: userDB,
  useVercelPostgresAdapter = false,
  syncDB,
  syncInterval,
  prodMigrations,
  sharp,
  ...config
}: CQLConfigType) {
  const plugins: CQLConfigType['plugins'] = [
    ...defaultPlugins({ ...config, baseURL }),
  ]

  return buildConfig({
    ...config,
    admin: {
      ...admin,
      user: collectionSlug['users'],
      meta: {
        titleSuffix: '- ContentQL',
        ...(admin.meta || {}),
      },
    },
    collections: [...collections],
    globals: [...globals],
    db:
      userDB ||
      db({
        databaseURI: dbURI,
        databaseSecret: dbSecret,
        useVercelPostgresAdapter,
        syncDB,
        syncInterval,
        prodMigrations,
      }),
    secret,
    plugins,
    cors: Array.isArray(cors) ? getWhitelistDomains(cors) : cors,
    csrf: csrf ? getWhitelistDomains(csrf) : csrf,
    editor,
    sharp,
    email: resend
      ? resendAdapter({
          apiKey: resend.apiKey,
          defaultFromAddress: resend.defaultFromAddress,
          defaultFromName: resend.defaultFromName,
        })
      : email,
  })
}
