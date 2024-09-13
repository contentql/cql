import { singularize } from "./singularize.js";

/**
 * Generates a breadcrumb URL for a document, based on its dynamic properties and collection.
 *
 * @param {any[]} docs - The array of document objects representing the breadcrumb trail.
 * @param {any} lastDoc - The last document in the breadcrumb trail.
 * @returns {string} - The generated breadcrumb URL.
 *
 * @example
 * ```
 * const docs = [
 *   { id: 1, path: '/section', slug: 'section' },
 *   { id: 2, path: '/section/subsection', slug: 'subsection' }
 * ]
 * const lastDoc = { id: 3, slug: 'final', isDynamic: true, _collection: 'articles' }
 *
 * const url = generateBreadcrumbsUrl(docs, lastDoc)
 *
 * // Example output: '/section/subsection/[final]'
 * ```
 */
export const generateBreadcrumbsUrl = (docs: any[], lastDoc: any): string => {
  // let prefix = ''
  // // You might want different prefixes for different collections.
  // switch (
  //   lastDoc._collection
  //   // Add cases as needed for different collections
  // ) {
  // }

  if (lastDoc?.isHome) {
    return "/";
  }

  // ! There no need of combining all parents path
  // const parentsPath = lastDoc?.isDynamic
  //   ? docs.reduce(
  //       (url: string, doc: any) =>
  //         doc?.id !== lastDoc?.id ? `${url}${doc.path ?? ''}` : url,
  //       prefix,
  //     )
  //   : ''

  const parentDoc = docs.find((doc) => doc.id === lastDoc.parent);

  // ! Just find its parent path if it has a parent
  const parentPath =
    lastDoc?.parent && parentDoc?.path !== "/" ? parentDoc.path : "";

  const slug = lastDoc?.isDynamic ? `[${lastDoc?.slug}]` : `${lastDoc?.slug}`;

  const singularizedParentPath = singularize(parentPath);

  const path = `${singularizedParentPath}/${slug}`;

  return path;
};
