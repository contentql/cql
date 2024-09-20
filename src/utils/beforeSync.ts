import type { BeforeSync } from "@payloadcms/plugin-search/dist/types.js";
import { collectionSlug } from "../core/collectionSlug";

// Before creating or updating a search record, the beforeSync function runs.
// While saving we're saving the fields like title, path, description are saved & they can be parsed during the retrieval process
export const BeforeSyncConfig: BeforeSync = ({ originalDoc, searchDoc }) => {
  // Author details
  if (searchDoc?.doc?.relationTo === collectionSlug["users"]) {
    const authorDetails = {
      title: originalDoc?.displayName || originalDoc?.username,
      imageURL: originalDoc?.imageUrl,
      path: originalDoc?.username,
      // added this field for segregation purposes
      category: "authors",
    };

    return {
      ...searchDoc,
      title: JSON.stringify(authorDetails),
    };
  }
  // Blog details
  else if (searchDoc?.doc?.relationTo === collectionSlug["blogs"]) {
    const blogDetails = {
      title: originalDoc?.title,
      description: originalDoc?.description,
      path: originalDoc?.slug,
      // added this field for segregation purposes
      category: "blogs",
    };

    return {
      ...searchDoc,
      title: JSON.stringify(blogDetails),
    };
  }
  // Tags details
  else if (searchDoc?.doc?.relationTo === collectionSlug["tags"]) {
    const tagsDetails = {
      title: originalDoc?.title,
      path: originalDoc?.slug,
      // added this field for segregation purposes
      category: "tags",
    };

    return {
      ...searchDoc,
      title: JSON.stringify(tagsDetails),
    };
  }

  // returning empty values on rare case
  return {
    ...searchDoc,
    title: "",
  };
};
