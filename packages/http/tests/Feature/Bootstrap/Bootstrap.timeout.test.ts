import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return a timeout error', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(
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

    it('when the server does not answer within the timeout', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.get<unknown>('https://api.example.com/slow').timeout(20);

        expect(data).toBeNull();
        expect(error?.status).toBe(0);
        expect(error?.message).toBe('The request timed out after 20 ms');
    });
});
