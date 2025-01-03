export type SlugType =
  | 'users'
  | 'tags'
  | 'blogs'
  | 'media'
  | 'pages'
  | 'site-settings'
  | 'products'
  | 'search'
  | 'categories'

export type CollectionSlugListType =
  | 'users'
  | 'tags'
  | 'blogs'
  | 'media'
  | 'pages'
  | 'products'
  | 'search'
  | 'categories'

export type GlobalSlugListType = 'site-settings'

export type CollectionSlugType = {
  [key in SlugType]: key
}

/**
 * You'll get [users, tags, blog, pages, media, search, site-settings] collections out of the box
 */
export const collectionSlug: CollectionSlugType = {
  users: 'users',
  tags: 'tags',
  blogs: 'blogs',
  media: 'media',
  pages: 'pages',
  search: 'search',
  products: 'products',
  'site-settings': 'site-settings',
  categories: 'categories',
}
