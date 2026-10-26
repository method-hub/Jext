import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should append the query to the URL', () => {
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

    it('when query is called twice', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/events')
            .query({ room: 1 })
            .query({ since: 'a' });

        for await (const event of events) {
            void event;
        }

        const [[url]] = stream.mock.calls;
        expect(url).toBe('https://api.example.com/events?room=1&since=a');
    });
});
