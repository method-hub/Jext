import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should parse the data of a POST stream as JSON', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('data: {"delta":"Hel"}\n\ndata: {"delta":"lo"}\n\n', {
                headers: { 'Content-Type': 'text/event-stream' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a chat prompt is posted with a token', async () => {
        const http = new Bootstrap().init();
        let text = '';

        for await (const { data } of http
            .sse('https://api.example.com/chat')
            .headers({ Authorization: 'Bearer t' })
            .body({ prompt: 'Hi' })
            .json<{ delta: string }>()) {
            text += data.delta;
        }

        const [[, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(text).toBe('Hello');
        expect(init.method).toBe('POST');
        expect(init.body).toBe('{"prompt":"Hi"}');
        expect(new Headers(init.headers).get('Authorization')).toBe('Bearer t');
    });
});
