/**
 * @summary A single query parameter value; `null` and `undefined` are left out of the URL.
 */
export type QueryValue = string | number | boolean | null | undefined;

/**
 * @summary Query parameters: an array value repeats the key (`tags=a&tags=b`).
 */
export type Query = Record<string, QueryValue | readonly QueryValue[]>;
