import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export const db = ({
  databaseURI,
  databaseSecret,
  useVercelPostgresAdapter = false,
}: {
  databaseURI?: string
  databaseSecret?: string
  useVercelPostgresAdapter?: boolean
}) => {
  const isMongo = databaseURI && databaseURI.startsWith('mongodb')
  const isPostgresql = databaseURI && databaseURI.startsWith('postgresql')
  const isVercel = process.env.VERCEL ?? false
  const isRailway = process.env.RAILWAY_PROJECT_ID ?? false

  // if database is postgresql & user specified to use useVercelPostgresAdapter using vercelPostgresAdapter
  if (useVercelPostgresAdapter && isPostgresql) {
    return vercelPostgresAdapter({
      pool: {
        connectionString: databaseURI,
      },
    })
  }
  // if normal postgres means using postgresAdapter
  else if (isPostgresql) {
    return postgresAdapter({
      pool: {
        connectionString: databaseURI,
      },
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

  return sqliteAdapter({
    client: {
      // in railway we're will use turso as sync database
      url: !isRailway && databaseURI ? databaseURI : 'file:data/payload.db',
      authToken: databaseSecret,
      // if deployment environment is not vercel & databaseURL provided making that URL as syncURL
      syncUrl: !isVercel && databaseURI ? databaseURI : undefined,
      syncInterval: 60,
    },
  })
}
