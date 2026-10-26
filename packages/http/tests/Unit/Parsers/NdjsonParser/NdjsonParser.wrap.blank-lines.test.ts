import { describe, expect, it } from 'vitest';
import NdjsonParser from '@Http/Parsers/NdjsonParser';

describe('NdjsonParser.wrap should skip blank lines', () => {
    it('when lines end with CRLF and some are empty', async () => {
        const response = new Response('{"id":1}\r\n\n{"id":2}\n');
        const parser = new NdjsonParser<{ id: number }>();

        const data = await parser.wrap(response);

        expect(data).toEqual([{ id: 1 }, { id: 2 }]);
    });
});
