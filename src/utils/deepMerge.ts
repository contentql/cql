// @ts-nocheck
import uniq from "lodash.uniq";

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

export const deepMerge = <T, R>(
  defaultConfiguration: T,
  userConfiguration: R
): T => {
  const outputConfiguration = { ...defaultConfiguration };

  // checking both are objects or not
  if (isObject(defaultConfiguration) && isObject(userConfiguration)) {
    // mapping through all keys in userConfig object
    Object.keys(userConfiguration).forEach((key) => {
      // checking if value is object
      if (isObject(userConfiguration[key])) {
        // if key not present in default-config adding that to default-config
        if (!(key in defaultConfiguration)) {
          Object.assign(outputConfiguration, { [key]: userConfiguration[key] });
        } else {
          // if key is present both in default & user config, then doing recursion
          outputConfiguration[key] = deepMerge(
            defaultConfiguration[key],
            userConfiguration[key]
          );
        }
      } else {
        // if value is not object & not present in default-config add that to default-config
        if (!(key in defaultConfiguration)) {
          Object.assign(outputConfiguration, { [key]: userConfiguration[key] });
        }

        if (
          Array.isArray(defaultConfiguration[key]) &&
          Array.isArray(userConfiguration[key])
        ) {
          // creating boolean array based on if the array elements are object or not
          const objectsArray = defaultConfiguration[key].map((item) =>
            isObject(item)
          );

          // if array has object then assuming it as fields object and checking the name property
          if (objectsArray.every(Boolean)) {
            // spreading the list of default configuration array
            const defaultList = [...defaultConfiguration[key]];

            // mapping through user array
            userConfiguration[key].forEach((userFieldDetails) => {
              const index = defaultList.findIndex((defaultFieldValue) => {
                // checking for name for fields array
                if (defaultFieldValue?.name) {
                  return defaultFieldValue?.name === userFieldDetails?.name;
                }

                // checking for value in options array
                if (defaultFieldValue?.value) {
                  return defaultFieldValue?.value === userFieldDetails?.value;
                }
              });

              // if anything is overlapping doing a deepMerge
              if (index !== -1) {
                defaultList[index] = deepMerge(
                  defaultList[index],
                  userFieldDetails
                );
              }
              // else pushing that to default configuration
              else {
                defaultList.push(userFieldDetails);
              }
            });

            outputConfiguration[key] = defaultList;
          }
          // else using ramda uniq for maintaining unique elements
          else {
            outputConfiguration[key] = uniq([
              ...defaultConfiguration[key],
              ...userConfiguration[key],
            ]);
          }
        }
      }
    });
  }

  return outputConfiguration;
};
