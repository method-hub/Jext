import { describe, expect, it } from 'vitest';
import JsonParser from '@Http/Parsers/JsonParser';

describe('JsonParser.parse should reject the response', () => {
    it.each(['text/plain', 'text/csv', 'text/html'])('when Content-Type is %s', async (contentType) => {
        const response = new Response('42');
        const parser = new JsonParser<unknown>();

        const accepted = await parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
