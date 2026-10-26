import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for text-based content types.
 *
 * @description Catch-all for text/* and common application text formats.
 */
export default class TextParser implements Decoder<string> {
    /**
     * @summary Accepts `text/*`, JavaScript and SQL.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return (
            contentType.startsWith('text/') ||
            contentType.includes('application/javascript') ||
            contentType.includes('application/x-javascript') ||
            contentType.includes('application/sql')
        );
    }

    /**
     * @summary Reads the body as text.
     *
     * @param response - The accepted response.
     * @returns The body as a string.
     */
    public async wrap(response: Response): Promise<string> {
        return response.text();
    }
}
