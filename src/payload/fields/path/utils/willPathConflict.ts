import type { Payload } from 'payload'

export const willPathConflict = async ({
  payload,
  path,
  currentDocId,
  currentCollection,
  collectionsToCheck = [],
}: {
  payload: Payload
  path: string
  currentDocId?: string
  currentCollection: string
  collectionsToCheck?: string[]
}) => {
  if (!payload || collectionsToCheck.length === 0) return false

  const queries = collectionsToCheck.map(collection => {
    const whereCondition: any = {
      path: {
        equals: path,
      },
    }
    if (currentDocId && currentCollection === collection) {
      whereCondition.id = { not_equals: currentDocId }
    }

    return payload.find({
      // @ts-ignore
      collection,
      where: whereCondition,
      limit: 1,
    })
  })

  const results = await Promise.allSettled(queries)
  return results.some(
    result => result.status === 'fulfilled' && result.value.docs.length > 0,
  )
}
