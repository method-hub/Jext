import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should release the body of a response it repeats', () => {
    let failed: Response;

    beforeEach(() => {
        failed = new Response('busy', { status: 503 });
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(failed).mockResolvedValueOnce(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a 503 response is retried', async () => {
        await Delivery.send('https://api.example.com/users', {}, { retry: { limit: 1, delay: 0 } });

        expect(failed.bodyUsed).toBe(true);
    });
});
