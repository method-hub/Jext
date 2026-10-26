import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should send a POST with a JSON body', () => {
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

    it('when a body object is set and no method', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/chat').body({ prompt: 'Hi' });

        for await (const event of events) {
            void event;
        }

        const [[, init]] = stream.mock.calls;
        expect(init.method).toBe('POST');
        expect(init.body).toBe('{"prompt":"Hi"}');
        expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
    });
});
