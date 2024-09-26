import { Job, scheduledJobs } from 'node-schedule'
import { CollectionAfterChangeHook, CollectionSlug } from 'payload'

export const triggerScheduleAfterChange: CollectionAfterChangeHook = async ({
  req,
  collection,
  operation,
  doc,
  previousDoc,
  context,
}) => {
  const { payload } = req
  const publishOn = doc?.publishOn
  const jobId = doc.id
  const slug = collection.slug as CollectionSlug

  // If `publishOn` is in the past, return
  if (
    publishOn &&
    new Date(publishOn) < new Date() &&
    (operation === 'create' || doc?.publishOn !== previousDoc?.publishOn)
  ) {
    const errorMessage = `Cannot schedule job: ${jobId} in collection: ${slug} because the publish date is in the past (${publishOn}).`
    payload.logger.error(errorMessage)
    return
  }

  // If the status is already published, no further action is needed
  if (doc._status === 'published') {
    // Check if there is an existing scheduled job and cancel it if needed
    const existingJob = scheduledJobs[jobId]
    if (existingJob) {
      existingJob.cancel()
      payload.logger.info(
        `Canceled job: ${jobId} in collection: ${slug} because the document is manually published.`,
      )
    }
    return
  }

  // Check if there's already a scheduled job for this document
  const existingJob = scheduledJobs[jobId]

  // Case 1: Job exists and `publishOn` date is present, reschedule it
  if (existingJob && publishOn) {
    existingJob.reschedule(publishOn)
    payload.logger.info(
      `Rescheduled job: ${jobId} in collection: ${slug} to ${publishOn}`,
    )
  }
  // Case 2: Job exists but no `publishOn` date, cancel it
  else if (existingJob && !publishOn) {
    existingJob.cancel()
    payload.logger.info(`Canceled job: ${jobId} in collection: ${slug}`)
  }
  // Case 3: Job does not exist, but `publishOn` date is present, schedule a new job
  else if (!existingJob && publishOn) {
    const newJob = new Job(jobId, async () => {
      try {
        await payload.update({
          id: doc.id,
          collection: slug,
          data: {
            _status: 'published',
          },
        })
        // Log after the job is successfully triggered
        payload.logger.info(
          `Successfully triggered job: ${jobId} in collection: ${slug} and updated document status to 'published'`,
        )
      } catch (error) {
        if (error instanceof Error) {
          payload.logger.error(
            `Failed to trigger job: ${jobId} in collection: ${slug}. Error: ${error.message}`,
          )
        } else {
          payload.logger.error(
            `Failed to trigger job: ${jobId} in collection: ${slug}. Unknown error occurred.`,
          )
        }
      }
    })
    newJob.schedule(publishOn)
    payload.logger.info(
      `Scheduled new job: ${jobId} in collection: ${slug} for ${publishOn}`,
    )
  }
  // Case 4: No job exists and no `publishOn` date, do nothing
  else {
    payload.logger.info(
      `No action needed for job: ${jobId} in collection: ${slug}`,
    )
  }
}
