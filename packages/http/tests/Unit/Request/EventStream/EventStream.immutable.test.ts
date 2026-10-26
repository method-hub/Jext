import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should leave the original stream as it was', () => {
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

    it('when chain methods are called on it', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/events');
        const linked = events.method('POST').headers({ 'X-A': '1' }).query({ a: 1 }).reconnect().json();

        for await (const event of events) {
            void event;
        }

        const [[url, init, settings]] = stream.mock.calls;
        expect(linked).not.toBe(events);
        expect(url).toBe('https://api.example.com/events');
        expect(init.method).toBe('GET');
        expect(new Headers(init.headers).has('X-A')).toBe(false);
        expect(settings).toEqual({});
    });
});
