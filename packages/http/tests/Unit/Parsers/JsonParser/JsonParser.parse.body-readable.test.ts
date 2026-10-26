import { describe, expect, it } from 'vitest';
import JsonParser from '@Http/Parsers/JsonParser';

describe('JsonParser.parse should leave the body readable', () => {
    it('when it has sniffed a JSON body', async () => {
        const response = new Response('{"id":1}');
        const parser = new JsonParser<{ id: number }>();

        await parser.parse({ response, contentType: '', disposition: '' });

        await expect(parser.wrap(response)).resolves.toEqual({ id: 1 });
    });

    it('when sniffing failed on a non-JSON body', async () => {
        const response = new Response('hello');
        const parser = new JsonParser<unknown>();

        await parser.parse({ response, contentType: '', disposition: '' });

        await expect(response.text()).resolves.toBe('hello');
    });
});
