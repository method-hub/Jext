import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.get should accept a URL object', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the URL is passed as URL', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await http.get<string>(new URL('https://api.example.com/users')).query({ page: 1 });

        expect(fetch).toHaveBeenCalledWith('https://api.example.com/users?page=1', expect.anything());
    });
});
