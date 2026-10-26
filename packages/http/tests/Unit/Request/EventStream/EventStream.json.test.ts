import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should ask the streamer to parse data as JSON', () => {
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

    it('when json is called', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/events').json<{ text: string }>();

        for await (const event of events) {
            void event;
        }

        const [[, , settings]] = stream.mock.calls;
        expect(settings.json).toBe(true);
    });
});
