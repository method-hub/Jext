import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should keep the Accept header that was set', () => {
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

    it('when Accept is given by the caller', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/events').headers({ Accept: 'text/plain' });

        for await (const event of events) {
            void event;
        }

        const [[, init]] = stream.mock.calls;
        expect(new Headers(init.headers).get('Accept')).toBe('text/plain');
    });
});
