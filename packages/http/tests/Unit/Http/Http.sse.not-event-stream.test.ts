import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should throw an HttpError', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a 2xx response is not text/event-stream', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const loop = async (): Promise<void> => {
            for await (const event of http.sse('https://api.example.com/events')) {
                void event;
            }
        };

        await expect(loop()).rejects.toMatchObject({
            name: 'HttpError',
            message: 'The response is not an event stream',
            status: 200,
        });
    });
});
