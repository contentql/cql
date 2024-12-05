import { revalidatePath } from 'next/cache'
import { CollectionAfterChangeHook } from 'payload'

export const revalidatePost: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  const { payload, context } = req

  if (!context?.disableRevalidate) {
    const path = '/posts/${doc?.slug}'

    revalidatePath(path)
  }

  return doc
}
