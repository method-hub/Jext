import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return the data and no error', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('hello'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the chain decodes the response', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const result = await http.send<string>('https://api.example.com/text');

        expect(result).toEqual({ data: 'hello', error: null });
    });
});
