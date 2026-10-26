import { describe, expect, it } from 'vitest';
import NdjsonParser from '@Http/Parsers/NdjsonParser';

describe('NdjsonParser.wrap should return one value per line', () => {
    it('when every line is JSON', async () => {
        const response = new Response('{"id":1}\n{"id":2}\n"three"');
        const parser = new NdjsonParser<{ id: number } | string>();

        const data = await parser.wrap(response);

        expect(data).toEqual([{ id: 1 }, { id: 2 }, 'three']);
    });
});
