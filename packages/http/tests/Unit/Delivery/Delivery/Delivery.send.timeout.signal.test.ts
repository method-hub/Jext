import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should reject with an AbortError', () => {
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

    it('when the caller aborts before the timeout', async () => {
        const controller = new AbortController();
        const sending = Delivery.send('https://api.example.com/slow', { signal: controller.signal }, { timeout: 5000 });

        controller.abort();

        await expect(sending).rejects.toHaveProperty('name', 'AbortError');
    });
});
