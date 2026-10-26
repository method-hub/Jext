import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return null data', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a DELETE request gets 204 No Content', async () => {
        const http = new Bootstrap().init();

        const result = await http.delete<null>('https://api.example.com/users/7');

        expect(result).toEqual({ data: null, error: null });
    });
});
