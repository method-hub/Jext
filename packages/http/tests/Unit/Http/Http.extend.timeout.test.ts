import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should apply its timeout to every request', () => {
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

    it('when the server does not answer in time', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ timeout: 20 });

        const { data, error } = await api.get<string>('/slow');

        expect(data).toBeNull();
        expect(error?.status).toBe(0);
        expect(error?.message).toBe('The request timed out after 20 ms');
        expect(error?.cause).toHaveProperty('name', 'TimeoutError');
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
