import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return an HttpError with null data', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers 401 without a body', async () => {
        const http = new Bootstrap().init();

        const { error } = await http.send<unknown>('https://api.example.com/me');

        expect(error?.status).toBe(401);
        expect(error?.data).toBeNull();
    });
});
