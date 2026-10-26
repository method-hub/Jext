import Root from '@Http/Root/Root';
import EmptyParser from '@Http/Parsers/EmptyParser';
import JsonParser from '@Http/Parsers/JsonParser';
import XmlParser from '@Http/Parsers/XmlParser';
import UrlEncodedParser from '@Http/Parsers/UrlEncodedParser';
import FormDataParser from '@Http/Parsers/FormDataParser';
import DomParser from '@Http/Parsers/DomParser';
import BinaryParser from '@Http/Parsers/BinaryParser';
import BlobParser from '@Http/Parsers/BlobParser';
import NdjsonParser from '@Http/Parsers/NdjsonParser';
import CsvParser from '@Http/Parsers/CsvParser';
import SseParser from '@Http/Parsers/SseParser';
import MediaParser from '@Http/Parsers/MediaParser';
import TextParser from '@Http/Parsers/TextParser';
import Http from '@Http/Http';
import Picker from '@Http/Root/Picker';

/**
 * @summary Factory that assembles and configures the Fluent HTTP client.
 *
 * @description Composes the parser chain in the correct priority order
 * and returns a ready-to-use `Http` instance.
 */
export default class Bootstrap {
    /**
     * @summary Builds the parser chain and initializes the client.
     *
     * @returns A ready-to-use fluent client instance.
     *
     * @example
     * export const http = new Bootstrap().init();
     */
    public init(): Http {
        const { empty, json, xml, urlencoded, formData, html, binary, attachment, ndjson, csv, sse, media, text } =
            Bootstrap.decoders();

        // A response without a body goes first, so that nothing below tries to read it.
        // Attachments (BlobParser) win over the formats after them: a downloaded CSV or image stays a file.
        // TextParser is the catch-all for text/* and common text formats.
        const root = new Root();
        [empty, json, xml, urlencoded, formData, html, binary, attachment, ndjson, csv, sse, media, text].forEach(
            (parser) => root.add(parser)
        );

        // The decoders .as(format) uses: the same instances as in the chain
        const picker = new Picker(empty, {
            json,
            ndjson,
            xml,
            html,
            text,
            csv,
            formData,
            urlencoded,
            blob: media,
            arrayBuffer: binary,
            sse,
        });

        return new Http(root, picker);
    }

    /**
     * @summary Creates one instance of every decoder, shared by the chain and the `Picker`.
     *
     * @returns The decoders by name.
     */
    private static decoders() {
        return {
            empty: new EmptyParser(),
            json: new JsonParser(),
            xml: new XmlParser(),
            urlencoded: new UrlEncodedParser(),
            formData: new FormDataParser(),
            html: new DomParser(),
            binary: new BinaryParser(),
            attachment: new BlobParser(),
            ndjson: new NdjsonParser(),
            csv: new CsvParser(),
            sse: new SseParser(),
            media: new MediaParser(),
            text: new TextParser(),
        };
    }
}
