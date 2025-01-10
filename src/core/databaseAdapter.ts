import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export const db = ({
  databaseURI,
  databaseSecret,
  useVercelPostgresAdapter = false,
  syncDB = true,
  syncInterval = 60,
  prodMigrations,
}: {
  databaseURI?: string
  databaseSecret?: string
  useVercelPostgresAdapter?: boolean
  syncDB?: boolean
  syncInterval?: number
  prodMigrations?: {
    down: (args: any) => Promise<void>
    name: string
    up: (args: any) => Promise<void>
  }[]
}) => {
  const isMongo = databaseURI && databaseURI.startsWith('mongodb')
  const isPostgresql = databaseURI && databaseURI.startsWith('postgresql')
  const isVercel = process.env.VERCEL

  // if database is postgresql & user specified to use useVercelPostgresAdapter using vercelPostgresAdapter
  if (useVercelPostgresAdapter && isPostgresql) {
    return vercelPostgresAdapter({
      pool: {
        connectionString: databaseURI,
      },
      prodMigrations,
    })
  }
  // if normal postgres means using postgresAdapter
  else if (isPostgresql) {
    return postgresAdapter({
      pool: {
        connectionString: databaseURI,
      },
      prodMigrations,
    })
  }
  // if mongodb means using mongooseAdapter
  else if (isMongo) {
    return mongooseAdapter({
      url: databaseURI,
    })
  }

  // if deployment environment is vercel & databaseURL not provided throwing error
  if (isVercel && !databaseURI) {
    throw new Error('Please provide database connection string')
  }

  // if deployment is done in vercel or syncDB = false then directly connect to DB
  if (isVercel || (databaseURI && !syncDB)) {
    return sqliteAdapter({
      client: {
        url: databaseURI!,
        authToken: databaseSecret,
      },
      prodMigrations,
    })
  }

  // default case always connects to file:./data/payload.db
  // if databaseURI is given, it'll be used for sync
  return sqliteAdapter({
    client: {
      url: 'file:data/payload.db',
      authToken: databaseSecret,
      ...(databaseURI
        ? {
            syncUrl: databaseURI,
            syncInterval,
          }
        : {}),
    },
    prodMigrations,
  })
}
