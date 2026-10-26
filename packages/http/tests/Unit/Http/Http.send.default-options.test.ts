import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should pass empty request options to fetch', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when no options are given', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await http.send('https://api.example.com/items');

        expect(fetch).toHaveBeenCalledWith('https://api.example.com/items', {});
    });
});
