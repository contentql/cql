import type { Block } from 'payload'
import { CustomCollectionConfig } from '../../../core/payload-overrides.js'

import { collectionSlug } from '../../../core/collectionSlug.js'
import { isAdmin } from '../../access/index.js'
import homeBlockConfig from '../../blocks/homeBlockConfig.js'
import { layoutField } from '../../fields/layout/index.js'
import { pathField, pathModeField } from '../../fields/path/index.js'
import { slugField, slugModeField } from '../../fields/slug/index.js'

type BlocksType = {
  blocks?: Block[]
}

export const Pages = ({ blocks = [] }: BlocksType): CustomCollectionConfig => {
  return {
    slug: collectionSlug.pages,
    labels: {
      singular: 'Page',
      plural: 'Pages',
    },
    access: {
      read: isAdmin,
      update: isAdmin,
      create: isAdmin,
      delete: isAdmin,
    },
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'path', 'updatedAt', 'createdAt'],
    },
    versions: {
      drafts: {
        autosave: false,
      },
      maxPerDoc: 10,
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Page',
            fields: [
              {
                name: 'title',
                type: 'text',
                required: true,
                unique: true,
              },
              layoutField({
                blocks: blocks.length ? blocks : [homeBlockConfig],
              }),
            ],
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'isHome',
            label: 'Home Page',
            type: 'checkbox',
            defaultValue: false,
          },
          {
            name: 'isDynamic',
            label: 'Dynamic Page',
            type: 'checkbox',
            defaultValue: false,
          },
        ],
        admin: {
          position: 'sidebar',
        },
      },
      slugModeField(),
      slugField('title'),
      pathModeField(),
      pathField(),
    ],
  }
}
