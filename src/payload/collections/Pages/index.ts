import { collectionSlug } from '../../../core/collectionSlug.js'
import { CustomCollectionConfig } from '../../../core/payload-overrides.js'
import { isAdmin } from '../../access/isAdmin.js'
import homeBlockConfig from '../../blocks/homeBlockConfig.js'
import { layoutField } from '../../fields/layout/index.js'
import { pathField, pathModeField } from '../../fields/path/index.js'
import { slugField, slugModeField } from '../../fields/slug/index.js'
import { CONTENT_GROUP } from '../constants.js'
import type { Block } from 'payload'

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
      read: () => true,
      update: isAdmin,
      create: isAdmin,
      delete: isAdmin,
    },
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'path', 'updatedAt', 'createdAt'],
      group: CONTENT_GROUP,
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
      slugField({ fieldToUse: 'title' }),
      pathModeField(),
      pathField(),
    ],
  }
}
