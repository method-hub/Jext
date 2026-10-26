import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should send a GET that accepts text/event-stream', () => {
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

    it('when no method and no body are set', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/events');

        for await (const event of events) {
            void event;
        }

        const [[url, init]] = stream.mock.calls;
        expect(url).toBe('https://api.example.com/events');
        expect(init.method).toBe('GET');
        expect(init.body).toBeNull();
        expect(new Headers(init.headers).get('Accept')).toBe('text/event-stream');
    });
});
