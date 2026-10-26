import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should keep the settings of the client it extends', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a client is extended twice', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ baseUrl: 'https://api.example.com', headers: { Authorization: 'Bearer t' } });
        const admin = api.extend({ headers: { 'X-Role': 'admin' } });

        await admin.delete<string>('/orders/7');

        const [[url, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        const headers = new Headers(init.headers);
        expect(url).toBe('https://api.example.com/orders/7');
        expect(headers.get('Authorization')).toBe('Bearer t');
        expect(headers.get('X-Role')).toBe('admin');
    });
});
