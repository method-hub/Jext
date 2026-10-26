import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return an HttpError that names the timeout', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(
            (_url, init) =>
                new Promise<Response>((_resolve, reject) => {
                    const { signal } = init;
                    signal.addEventListener('abort', () => {
                        const { name } = signal.reason as DOMException;
                        reject(new DOMException('The attempt was stopped', name));
                    });
                })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the attempt takes longer than the timeout', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const { data, error } = await http.send<string>('https://api.example.com/slow', {}, { timeout: 20 });

        expect(data).toBeNull();
        expect(error?.status).toBe(0);
        expect(error?.response).toBeNull();
        expect(error?.message).toBe('The request timed out after 20 ms');
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
