export type SlugType =
  | "users"
  | "tags"
  | "blogs"
  | "media"
  | "pages"
  | "site-settings";

export type CollectionSlugType = {
  [key in SlugType]: SlugType;
};

/**
 * You'll get [users, tags, blog, pages, media] collections out of the box
 */
export const collectionSlug: CollectionSlugType = {
  users: "users",
  tags: "tags",
  blogs: "blogs",
  media: "media",
  pages: "pages",
  "site-settings": "site-settings",
};
