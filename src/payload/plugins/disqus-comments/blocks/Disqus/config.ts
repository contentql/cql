import { Block } from 'payload'

const DisqusCommentsConfig: Block = {
  slug: 'DisqusComments',
  // imageURL: '',
  interfaceName: 'DisqusCommentsType',
  labels: {
    singular: 'Disqus Comment Block',
    plural: 'Disqus Comments Blocks',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
    },
    {
      type: 'text',
      name: 'shortName',
      label: 'Disqus Short Name',
      required: true,
      admin: {
        description:
          'To find your Disqus shortname, log into Disqus, access the Admin panel, and check the URL or General Site Settings.',
      },
    },
  ],
}

export default DisqusCommentsConfig
