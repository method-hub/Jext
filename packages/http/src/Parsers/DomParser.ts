import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for HTML/DOM content types.
 *
 * @description Uses the native `DOMParser` to parse HTML responses into a Document.
 */
export default class DomParser implements Decoder<Document> {
    /**
     * @summary Accepts `text/html`.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return contentType.startsWith('text/html');
    }

    /**
     * @summary Parses the body with `DOMParser`.
     *
     * @param response - The accepted response.
     * @returns The parsed HTML document.
     */
    public async wrap(response: Response): Promise<Document> {
        const html = await response.text();
        const parser = new DOMParser();

        return parser.parseFromString(html, 'text/html');
    }
}
