import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should throw an HttpError before it connects', () => {
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

    it('when the method is GET and a body is set', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/chat').method('GET').body('text');

        const loop = async (): Promise<void> => {
            for await (const event of events) {
                void event;
            }
        };

        await expect(loop()).rejects.toMatchObject({
            name: 'HttpError',
            status: 0,
            message: 'The request could not be built',
        });
        expect(stream).not.toHaveBeenCalled();
    });
});
