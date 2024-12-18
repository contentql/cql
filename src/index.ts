import type { CollectionSlugType, SlugType } from './core/collectionSlug.js'
import { collectionSlug } from './core/collectionSlug.js'
import type { CQLConfigType } from './core/cqlConfig.js'
import cqlConfig from './core/cqlConfig.js'
import type {
  CustomCollectionConfig,
  CustomField,
  CustomGlobalConfig,
  CustomMultiSelectField,
  CustomRadioField,
  CustomSelectField,
} from './core/payload-overrides.js'

export { collectionSlug, cqlConfig }
export type {
  CollectionSlugType,
  CQLConfigType,
  CustomCollectionConfig,
  CustomField,
  CustomGlobalConfig,
  CustomMultiSelectField,
  CustomRadioField,
  CustomSelectField,
  SlugType,
}
