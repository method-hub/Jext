import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should merge the headers', () => {
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

    it('when headers is called twice with the same header', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/events')
            .headers({ Authorization: 'Bearer a', 'X-Lang': 'en' })
            .headers({ Authorization: 'Bearer b' });

        for await (const event of events) {
            void event;
        }

        const [[, init]] = stream.mock.calls;
        const headers = new Headers(init.headers);
        expect(headers.get('Authorization')).toBe('Bearer b');
        expect(headers.get('X-Lang')).toBe('en');
    });
});
