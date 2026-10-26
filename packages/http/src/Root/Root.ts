import Hub from '@Http/Root/Hub';
import type { Chain } from '@Http/Contract/Chain';

/**
 * @summary Chain of Responsibility that hands an HTTP response to the first parser that accepts it.
 *
 * @description Checks each parser in insertion order. The first parser
 * that accepts the response handles it. Falls back to `arrayBuffer()` if none match.
 */
export default class Root<T> extends Hub<T> implements Chain<T> {
    /**
     * @summary Selects the appropriate parser and returns the processed response.
     *
     * @param response - The response to decode.
     * @returns The decoded body; an `ArrayBuffer` when no parser accepts the response.
     */
    public async decode(response: Response): Promise<T> {
        const contentType = (response.headers?.get('content-type') || '').toLowerCase();
        const disposition = (response.headers?.get('content-disposition') || '').toLowerCase();

        for (const parser of this.parsers.values()) {
            if (await parser.parse({ response, contentType, disposition })) {
                return parser.wrap(response);
            }
        }

        return response.arrayBuffer() as Promise<T>;
    }
}
