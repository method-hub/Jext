import { describe, expect, it } from 'vitest';
import JsonParser from '@Http/Parsers/JsonParser';

describe('JsonParser.parse should accept the response', () => {
    it.each([
        'application/json',
        'application/json; charset=utf-8',
        'application/vnd.api+json',
        'application/problem+json',
    ])('when Content-Type is %s', async (contentType) => {
        const response = new Response('42');
        const parser = new JsonParser<unknown>();

        const accepted = await parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(true);
    });
});
