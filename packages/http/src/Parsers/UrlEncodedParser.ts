import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for `application/x-www-form-urlencoded` content.
 */
export default class UrlEncodedParser implements Decoder<URLSearchParams> {
    /**
     * @summary Accepts `application/x-www-form-urlencoded`.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return contentType.startsWith('application/x-www-form-urlencoded');
    }

    /**
     * @summary Reads the body as URL-encoded pairs.
     *
     * @param response - The accepted response.
     * @returns The body as `URLSearchParams`.
     */
    public async wrap(response: Response): Promise<URLSearchParams> {
        return new URLSearchParams(await response.text());
    }
}
