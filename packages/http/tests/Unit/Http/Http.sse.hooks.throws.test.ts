import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should throw the HttpError of the hook without reconnecting', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(new Response('data: a\n\n', { headers: { 'Content-Type': 'text/event-stream' } }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a beforeRequest hook throws', async () => {
        const http = new Http(new Root<string>().add(new TextParser())).extend({
            hooks: {
                beforeRequest: [
                    () => {
                        throw new Error('no token');
                    },
                ],
            },
        });

        const loop = async (): Promise<void> => {
            for await (const event of http.sse('https://api.example.com/events').reconnect({ delay: 0 })) {
                void event;
            }
        };

        await expect(loop()).rejects.toHaveProperty('message', 'A beforeRequest hook failed');
        expect(fetch).not.toHaveBeenCalled();
    });
});
