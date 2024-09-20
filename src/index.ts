import cqlConfig from "./core/cqlConfig.js";
import type { CQLConfigType } from "./core/cqlConfig.js";
import { collectionSlug } from "./core/collectionSlug.js";
import type { CollectionSlugType, SlugType } from "./core/collectionSlug.js";
import type { SearchPluginConfig } from "@payloadcms/plugin-search/dist/types.js";

export { cqlConfig, collectionSlug };
export type { CQLConfigType, CollectionSlugType, SlugType, SearchPluginConfig };
