import { describe, expect, it } from 'vitest';
import XmlParser from '@Http/Parsers/XmlParser';

describe('XmlParser.wrap should return the document as a plain object', () => {
    it('when the body is valid XML', async () => {
        const response = new Response('<root><item>1</item><item>2</item></root>');
        const parser = new XmlParser<{ root: { item: number[] } }>();

        const data = await parser.wrap(response);

        expect(data).toEqual({ root: { item: [1, 2] } });
    });
});
