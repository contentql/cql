import { willPathConflict } from "../utils/willPathConflict.js";
import { getParents } from "@payloadcms/plugin-nested-docs";
import { APIError, type FieldHook } from "payload";

import { generateBreadcrumbsUrl } from "../../../../utils/generateBreadcrumbsUrl.js";
import { collectionSlug } from "../../../../core/collectionSlug.js";

export const generateAndValidatePath: FieldHook = async ({
  collection,
  req,
  value,
  siblingData,
  originalDoc,
  operation,
}) => {
  // This can happen if auto save is on.
  if (
    operation === "create" &&
    value == null &&
    (Object.keys(originalDoc).length === 0 ||
      Object.keys(siblingData).length === 0)
  )
    return value;

  const { payload } = req;

  if (!payload) return value; // If not server side exist

  const currentDoc = { ...originalDoc, ...siblingData };

  if (siblingData?.pathMode && siblingData?.pathMode === "custom") {
    return value;
  }

  const docs = await getParents(
    req,
    // @ts-ignore
    { parentFieldSlug: "parent" },
    collection,
    currentDoc,
    [currentDoc]
  );

  const updatedPath = generateBreadcrumbsUrl(docs, currentDoc);
  const isNewPathConflicting = await willPathConflict({
    payload,
    path: updatedPath,
    currentDocId: currentDoc.id,
    currentCollection: collection ? collection.slug : collectionSlug.pages,
    collectionsToCheck: [collectionSlug.pages], // Add more collections as needed
  });

  if (isNewPathConflicting) {
    const error = new APIError(
      "This will create a conflict with an existing path.",
      400,
      [
        {
          field: "path",
          message: "This will create a conflict with an existing path.",
        },
      ],
      false
    );
    throw error;
  }

  return updatedPath;
};
