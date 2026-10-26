import { XMLParser } from 'fast-xml-parser';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for XML content types.
 *
 * @description Uses `fast-xml-parser` to parse the XML response body into a plain object.
 *
 * @template T - The type of the parsed document.
 */
export default class XmlParser<T> implements Decoder<T> {
    /**
     * @summary Accepts `application/xml`, `text/xml`, `application/soap+xml` and any `+xml` type (SVG, XHTML).
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return (
            /\b\+xml\b/.test(contentType) ||
            contentType.startsWith('application/xml') ||
            contentType.startsWith('text/xml') ||
            contentType.includes('image/svg+xml') ||
            contentType.includes('application/xhtml+xml') ||
            contentType.startsWith('application/soap+xml')
        );
    }

    /**
     * @summary Parses the body with `fast-xml-parser` into a plain object.
     *
     * @param response - The accepted response.
     * @returns The parsed document.
     */
    public async wrap(response: Response): Promise<T> {
        const xmlText = await response.text();
        const parser = new XMLParser();

        return parser.parse(xmlText) as T;
    }
}
