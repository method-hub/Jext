import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should use the baseUrl, headers and hooks of the client', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(new Response('data: a\n\n', { headers: { 'Content-Type': 'text/event-stream' } }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the stream is opened from an extended client', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({
            baseUrl: 'https://api.example.com/v1',
            headers: { 'X-Lang': 'en' },
            hooks: {
                beforeRequest: [
                    ({ url, init }) => ({ url, init: { ...init, headers: { Authorization: 'Bearer t' } } }),
                ],
            },
        });

        for await (const event of api.sse('/events')) {
            void event;
        }

        const [[url, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(url).toBe('https://api.example.com/v1/events');
        expect(new Headers(init.headers).get('Authorization')).toBe('Bearer t');
    });
});
