import { describe, expect, it } from 'vitest';
import JsonParser from '@Http/Parsers/JsonParser';

describe('JsonParser.parse should detect JSON by the body', () => {
    it('when Content-Type is missing and the body is JSON', async () => {
        const response = new Response('{"id":1}');
        const parser = new JsonParser<{ id: number }>();

        const accepted = await parser.parse({ response, contentType: '', disposition: '' });

        expect(accepted).toBe(true);
    });
});
