import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';
import type { Reconnect } from '@Http/Contract/Reconnect';

describe('EventStream should ask the streamer to reconnect', () => {
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

    it.each<[string, Reconnect, Reconnect]>([
        ['a number', 3, 3],
        ['options', { retries: 2, delay: 50 }, { retries: 2, delay: 50 }],
    ])('when reconnect is called with %s', async (_name, reconnect, expected) => {
        const events = new EventStream(streamer, 'https://api.example.com/events').reconnect(reconnect);

        for await (const event of events) {
            void event;
        }

        const [[, , settings]] = stream.mock.calls;
        expect(settings.reconnect).toEqual(expected);
    });
});
