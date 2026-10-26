import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should throw an HttpError with the decoded error body', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('denied', {
                status: 401,
                statusText: 'Unauthorized',
                headers: { 'Content-Type': 'text/plain' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers 401, without reconnecting', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const loop = async (): Promise<void> => {
            for await (const event of http.sse('https://api.example.com/events').reconnect({ delay: 0 })) {
                void event;
            }
        };

        await expect(loop()).rejects.toMatchObject({
            name: 'HttpError',
            message: '401 Unauthorized',
            status: 401,
            data: 'denied',
        });
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
