import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should send the same request from options as from the chain', () => {
    let stream: Mock<(...args: [string, RequestInit, StreamSettings]) => AsyncIterable<ServerEvent>>;
    let streamer: Streamer;

    beforeEach(() => {
        stream = vi.fn<(...args: [string, RequestInit, StreamSettings]) => AsyncIterable<ServerEvent>>(
            async function* () {
                yield await Promise.resolve({ event: 'message', data: 'tick', id: '', retry: null });
            }
        );
        streamer = { stream } as unknown as Streamer;
    });

    it('when every option is given in the options object', async () => {
        const { signal } = new AbortController();
        const options = { method: 'POST' as const, headers: { 'X-A': '1' }, query: { a: 1 }, body: { q: 1 }, signal };
        const fromChain = new EventStream(streamer, 'https://api.example.com/events')
            .method('POST')
            .headers({ 'X-A': '1' })
            .query({ a: 1 })
            .body({ q: 1 })
            .signal(signal)
            .reconnect(2)
            .json();
        const fromOptions = new EventStream(streamer, 'https://api.example.com/events', {
            ...options,
            reconnect: 2,
            json: true,
        });

        for await (const event of fromChain) {
            void event;
        }
        for await (const event of fromOptions) {
            void event;
        }

        const [[chainUrl, chainInit, chainSettings], [optionsUrl, optionsInit, optionsSettings]] = stream.mock.calls;
        expect(optionsUrl).toBe(chainUrl);
        expect(optionsInit.method).toBe(chainInit.method);
        expect(optionsInit.body).toBe(chainInit.body);
        expect([...new Headers(optionsInit.headers)]).toEqual([...new Headers(chainInit.headers)]);
        expect(optionsSettings).toEqual(chainSettings);
    });
});
