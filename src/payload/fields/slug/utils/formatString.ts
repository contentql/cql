import slugify from "slugify";

export const formatString = (
  value: string,
  options: { trim: boolean } = { trim: false }
): string => {
  if (typeof value !== "string") {
    console.error("Invalid input: value must be a string");
    return "";
  }

  try {
    const formattedString = slugify(value, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      locale: "en",
      trim: options.trim,
      replacement: "-",
    });

    return formattedString;
  } catch (error) {
    console.error("Error in slugify:", error);
    return value;
  }
};
