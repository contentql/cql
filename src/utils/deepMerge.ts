// @ts-nocheck

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
  // spreading default-config in output config
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

        // if value is array then spreading it with default-config
        if (
          Array.isArray(defaultConfiguration[key]) &&
          Array.isArray(userConfiguration[key])
        ) {
          outputConfiguration[key] = [
            ...defaultConfiguration[key],
            ...userConfiguration[key],
          ];
        }
      }
    });
  }

  return outputConfiguration;
};
