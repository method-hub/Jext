import { describe, expect, it } from 'vitest';
import XmlParser from '@Http/Parsers/XmlParser';

describe('XmlParser.parse should accept the response', () => {
    it.each(['application/xml', 'text/xml', 'image/svg+xml', 'application/atom+xml', 'application/soap+xml'])(
        'when Content-Type is %s',
        (contentType) => {
            const response = new Response('<root/>');
            const parser = new XmlParser<unknown>();

            const accepted = parser.parse({ response, contentType, disposition: '' });

            expect(accepted).toBe(true);
        }
    );
});
