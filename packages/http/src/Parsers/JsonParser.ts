import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for JSON content types.
 *
 * @description Detects JSON by the Content-Type header. Only when the header is missing does it try to parse
 * the body, so a declared type such as `text/plain` or `text/csv` is never read as JSON.
 *
 * @template T - The type of the parsed JSON.
 */
export default class JsonParser<T> implements Decoder<T> {
    /**
     * @summary Accepts `application/json` and `+json` types; without a Content-Type, a body that parses as JSON.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public async parse({ response, contentType }: Data): Promise<boolean> {
        if (contentType.startsWith('application/json') || /\b\+json\b/.test(contentType)) {
            return true;
        }

        if (contentType !== '') {
            return false;
        }

        try {
            await response.clone().json();

            return true;
        } catch {
            return false;
        }
    }

    /**
     * @summary Parses the body as JSON.
     *
     * @param response - The accepted response.
     * @returns The parsed body.
     */
    public wrap(response: Response): Promise<T> {
        return response.json() as Promise<T>;
    }
}
