import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

/**
 * A body that gives one chunk and then fails, as a connection that drops.
 */
const dropping = (text: string): ReadableStream<Uint8Array> => {
    let pulls = 0;

    return new ReadableStream<Uint8Array>({
        pull(controller) {
            pulls += 1;

            if (pulls === 1) {
                controller.enqueue(new TextEncoder().encode(text));
            } else {
                controller.error(new TypeError('network error'));
            }
        },
    });
};

describe('Http.sse should throw an HttpError after the events received', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(dropping('data: a\n\n'), { headers: { 'Content-Type': 'text/event-stream' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the connection drops and reconnect is off', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: string[] = [];

        const loop = async (): Promise<void> => {
            for await (const event of http.sse('https://api.example.com/events')) {
                received.push(event.data);
            }
        };

        await expect(loop()).rejects.toMatchObject({
            name: 'HttpError',
            message: 'The event stream was interrupted',
            status: 200,
            cause: new TypeError('network error'),
        });
        expect(received).toEqual(['a']);
    });
});
