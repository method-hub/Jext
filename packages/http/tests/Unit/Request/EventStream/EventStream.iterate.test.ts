import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should yield the events of the streamer', () => {
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

    it('when it is iterated with for await', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/events');
        const received: ServerEvent[] = [];

        for await (const event of events) {
            received.push(event);
        }

        expect(received).toEqual([{ event: 'message', data: 'tick', id: '', retry: null }]);
        expect(stream).toHaveBeenCalledTimes(1);
    });
});
