import { describe, expect, it } from 'vitest';
import JsonParser from '@Http/Parsers/JsonParser';

describe('JsonParser.parse should reject a body that is not JSON', () => {
    it('when Content-Type is missing and the body is plain text', async () => {
        const response = new Response('hello');
        const parser = new JsonParser<unknown>();

        const accepted = await parser.parse({ response, contentType: '', disposition: '' });

        expect(accepted).toBe(false);
    });
});
