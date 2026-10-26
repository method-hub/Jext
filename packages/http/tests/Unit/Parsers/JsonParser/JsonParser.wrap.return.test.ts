import { describe, expect, it } from 'vitest';
import JsonParser from '@Http/Parsers/JsonParser';

describe('JsonParser.wrap should return the parsed body', () => {
    it('when the body is valid JSON', async () => {
        const response = new Response(JSON.stringify({ id: 1, name: 'test' }));
        const parser = new JsonParser<{ id: number; name: string }>();

        const data = await parser.wrap(response);

        expect(data).toEqual({ id: 1, name: 'test' });
    });
});
