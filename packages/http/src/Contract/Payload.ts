/**
 * @summary What `.body()` accepts.
 *
 * @description `FormData`, `URLSearchParams`, `Blob`, `ArrayBuffer`, typed arrays, streams and strings are sent
 * as they are; any other object, array, number or boolean is sent as JSON.
 */
export type Payload = BodyInit | object | number | boolean | null;
