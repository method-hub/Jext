import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.post should send the body from the options object', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when body is passed as an option', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await http.post<string>('/api/users', { body: { name: 'Alice' } });

        const [, init] = fetch.mock.calls[0] as [string, RequestInit];
        expect(init.body).toBe('{"name":"Alice"}');
        expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
    });
});
