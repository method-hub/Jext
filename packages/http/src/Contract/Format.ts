import type { ServerEvent } from '@Http/Contract/ServerEvent';

/**
 * @summary What `.as(format)` returns for each format.
 *
 * @description `json`, `ndjson` and `xml` keep the type given to the request (`http.get<User>(url).as('json')`),
 * the other formats always decode to the same type.
 *
 * @template T - The type given to the request.
 */
export interface Formats<T = unknown> {
    /** JSON parsed into the type given to the request. */
    json: T;
    /** Newline-delimited JSON: one value per line, in the type given to the request. */
    ndjson: T;
    /** XML parsed by `fast-xml-parser` into the type given to the request. */
    xml: T;
    /** HTML parsed by `DOMParser`. */
    html: Document;
    /** The body as text. */
    text: string;
    /** CSV split into rows and cells. */
    csv: string[][];
    /** A `multipart/form-data` body. */
    formData: FormData;
    /** An `application/x-www-form-urlencoded` body. */
    urlencoded: URLSearchParams;
    /** The body as a `Blob`, for files and media. */
    blob: Blob;
    /** The raw bytes of the body. */
    arrayBuffer: ArrayBuffer;
    /** Server-Sent Events read one by one with `for await`. */
    sse: AsyncIterable<ServerEvent>;
}

/**
 * @summary The name of a response format: `'json'`, `'csv'`, `'blob'` and so on.
 */
export type Format = keyof Formats;
