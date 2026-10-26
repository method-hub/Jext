import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return null data and no error', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when json is chosen and the server answers 204', async () => {
        const http = new Bootstrap().init();

        const result = await http.delete<{ id: number }>('https://api.example.com/users/1').as('json');

        expect(result).toEqual({ data: null, error: null });
    });
});
