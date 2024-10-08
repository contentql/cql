'use client'

import { DiscussionEmbed } from 'disqus-react'

export interface DisqusCommentsType {
  title?: string | null
  shortName: string
  id?: string | null
  blockName?: string | null
  blockType: 'DisqusComments'
}
interface DisqusCommentsProps extends DisqusCommentsType {
  params: {
    route: string[]
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  params,
  ...block
}) => {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const disqusConfig = {
    url: pageUrl,
    identifier: params?.route.at(-1),
    title: params?.route.at(-1),
  }

  return (
    <div id='disqus-container'>
      <DiscussionEmbed shortname={block?.shortName} config={disqusConfig} />
    </div>
  )
}
