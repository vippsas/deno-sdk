/**
 * Generates URL path parameters from a variable number of arguments.
 *
 * @param {Record<string, any>} params - An object containing key-value pairs to be converted into URL path parameters.
 * @returns {string} The generated URL path parameters.
 */
type Params = Record<string, string | number | boolean | null | undefined>;

export const generatePathParams = (params: Params): string => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return queryString ? `?${queryString}` : "";
};
