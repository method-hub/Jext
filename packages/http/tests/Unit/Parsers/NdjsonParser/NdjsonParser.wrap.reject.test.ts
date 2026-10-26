import { describe, expect, it } from 'vitest';
import NdjsonParser from '@Http/Parsers/NdjsonParser';

describe('NdjsonParser.wrap should reject', () => {
    it('when a line is not valid JSON', async () => {
        const response = new Response('{"id":1}\nnot json');
        const parser = new NdjsonParser<{ id: number }>();

        const data = parser.wrap(response);

        await expect(data).rejects.toHaveProperty('name', 'SyntaxError');
    });
});
