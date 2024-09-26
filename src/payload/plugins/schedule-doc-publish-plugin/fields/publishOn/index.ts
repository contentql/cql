import type { Field } from 'payload'

const currentDateTime = new Date()

export const publishOnField: Field = {
  name: 'publishOn',
  label: 'Publish On',
  type: 'date',
  admin: {
    description: 'Save it as draft to schedule.',
    position: 'sidebar',
    date: {
      pickerAppearance: 'dayAndTime',
      minDate: currentDateTime,
      timeIntervals: 1,
    },
    components: {
      Field: {
        path: '@contentql/core/client#CustomPublishOnField',
      },
      Label: {
        path: '@contentql/core/client#CustomPublishOnFieldLabel',
      },
    },
  },
}
