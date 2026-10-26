import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should throw an HttpError with status 0', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the connection cannot be made and reconnect is off', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const loop = async (): Promise<void> => {
            for await (const event of http.sse('https://api.example.com/events')) {
                void event;
            }
        };

        await expect(loop()).rejects.toMatchObject({
            name: 'HttpError',
            message: 'The request got no response',
            status: 0,
            cause: new TypeError('Failed to fetch'),
        });
    });
});
