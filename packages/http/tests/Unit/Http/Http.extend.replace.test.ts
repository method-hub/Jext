import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should replace the base URL of the client it extends', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the new client sets another base URL', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const v1 = http.extend({ baseUrl: 'https://api.example.com/v1' });
        const v2 = v1.extend({ baseUrl: 'https://api.example.com/v2' });

        await v2.get<string>('/users');

        expect(fetch).toHaveBeenCalledWith('https://api.example.com/v2/users', expect.anything());
    });
});
