import { describe, expect, it } from 'vitest';
import NdjsonParser from '@Http/Parsers/NdjsonParser';

describe('NdjsonParser.wrap should return an array', () => {
    it('when the body has a single line', async () => {
        const response = new Response('{"id":1}');
        const parser = new NdjsonParser<{ id: number }>();

        const data = await parser.wrap(response);

        expect(data).toEqual([{ id: 1 }]);
    });
});
