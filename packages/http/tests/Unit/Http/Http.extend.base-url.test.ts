import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should prefix relative URLs with the base URL', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a request is made through the new client', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ baseUrl: 'https://api.example.com/v2' });

        await api.get<string>('/users').query({ page: 2 });

        expect(fetch).toHaveBeenCalledWith('https://api.example.com/v2/users?page=2', expect.anything());
    });
});
