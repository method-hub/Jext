import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should throw an HttpError after the events that parsed', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('data: {"n":1}\n\ndata: [DONE]\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when data of an event is not JSON', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: unknown[] = [];

        const loop = async (): Promise<void> => {
            for await (const event of http.sse('https://api.example.com/chat').json().reconnect()) {
                received.push(event.data);
            }
        };

        await expect(loop()).rejects.toMatchObject({
            name: 'HttpError',
            message: 'The event data could not be decoded',
            status: 200,
        });
        expect(received).toEqual([{ n: 1 }]);
    });
});
