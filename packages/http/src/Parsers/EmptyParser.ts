import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

const NO_CONTENT_STATUSES = [204, 205, 304];

/**
 * @summary Decoder for responses without a body.
 *
 * @description Handles 204, 205 and 304 statuses, `Content-Length: 0` and responses whose body is `null`
 * (for example HEAD requests). Must run first, so that other decoders never try to read an empty body.
 */
export default class EmptyParser implements Decoder<null> {
    /**
     * @summary Accepts a response with no body: status 204, 205 or 304, `Content-Length: 0` or a `null` body.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ response }: Data): boolean {
        return (
            response.body === null ||
            NO_CONTENT_STATUSES.includes(response.status) ||
            response.headers.get('content-length') === '0'
        );
    }

    /**
     * @summary Gives `null` without reading the body.
     *
     * @returns `null`.
     */
    public wrap(): Promise<null> {
        return Promise.resolve(null);
    }
}
