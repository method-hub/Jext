import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import EventStream from '@Http/Request/EventStream';
import type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('EventStream should throw an HttpError with the cause', () => {
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

    it('when the body cannot be serialized to JSON', async () => {
        const events = new EventStream(streamer, 'https://api.example.com/chat').body({ id: BigInt(1) });

        const loop = async (): Promise<void> => {
            for await (const event of events) {
                void event;
            }
        };

        await expect(loop()).rejects.toHaveProperty('cause.name', 'TypeError');
        expect(stream).not.toHaveBeenCalled();
    });
});
