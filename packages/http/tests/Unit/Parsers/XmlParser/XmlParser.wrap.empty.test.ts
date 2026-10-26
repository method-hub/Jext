import { describe, expect, it } from 'vitest';
import XmlParser from '@Http/Parsers/XmlParser';

describe('XmlParser.wrap should return an empty object', () => {
    it('when the body is empty', async () => {
        const response = new Response('');
        const parser = new XmlParser<Record<string, never>>();

        const data = await parser.wrap(response);

        expect(data).toEqual({});
    });
});
