import { describe, expect, it } from 'vitest';
import XmlParser from '@Http/Parsers/XmlParser';

describe('XmlParser.wrap should drop attributes', () => {
    it('when elements have attributes', async () => {
        const response = new Response('<root><item id="7">text</item></root>');
        const parser = new XmlParser<{ root: { item: string } }>();

        const data = await parser.wrap(response);

        expect(data).toEqual({ root: { item: 'text' } });
    });
});
