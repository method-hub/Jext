import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should throw an HttpError after the last reconnect', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when every connection fails and two reconnects are allowed', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const loop = async (): Promise<void> => {
            for await (const event of http.sse('https://api.example.com/events').reconnect({ retries: 2, delay: 0 })) {
                void event;
            }
        };

        await expect(loop()).rejects.toHaveProperty('message', 'The request got no response');
        expect(fetch).toHaveBeenCalledTimes(3);
    });
});
