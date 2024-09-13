import { formatString } from "../utils/formatString.js";
import { FieldHook } from "payload";

export const formatSlug =
  (fallback: string | undefined): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (!fallback) {
      return formatSlug(value || "");
    }

    if (data?.isHome) return "home-page";

    if (typeof value === "string" && value.length > 0) {
      return formatString(value, { trim: true });
    }

    if (operation === "create") {
      const fallbackData =
        (data && data[fallback]) || (originalDoc && originalDoc[fallback]);

      if (fallbackData && typeof fallbackData === "string") {
        return formatString(fallbackData, { trim: true });
      }
    }

    return value;
  };
