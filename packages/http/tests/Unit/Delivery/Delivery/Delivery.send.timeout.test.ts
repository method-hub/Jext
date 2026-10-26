import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should reject with a TimeoutError', () => {
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
        const sending = Delivery.send('https://api.example.com/slow', {}, { timeout: 20 });

        await expect(sending).rejects.toHaveProperty('name', 'TimeoutError');
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
