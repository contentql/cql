import { CollectionSlug } from 'payload'

type Position = 'sidebar' | 'start' | 'end'

export interface PluginTypes {
  enabled?: boolean
  collections?: CollectionSlug[]
  position?: Position
}
