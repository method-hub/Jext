import { describe, expect, it } from 'vitest';
import JsonParser from '@Http/Parsers/JsonParser';

describe('JsonParser.wrap should reject', () => {
    it('when the body is not valid JSON', async () => {
        const response = new Response('{"id":');
        const parser = new JsonParser<{ id: number }>();

        const data = parser.wrap(response);

        await expect(data).rejects.toHaveProperty('name', 'SyntaxError');
    });
});
