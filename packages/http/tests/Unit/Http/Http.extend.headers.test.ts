import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should send its headers under the headers of the request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the request sets one header again', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ headers: { Authorization: 'Bearer t', 'X-Lang': 'en' } });

        await api.get<string>('/users').headers({ 'X-Lang': 'ru' });

        const [[, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        const headers = new Headers(init.headers);
        expect(headers.get('Authorization')).toBe('Bearer t');
        expect(headers.get('X-Lang')).toBe('ru');
    });
});
