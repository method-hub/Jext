import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return null', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(null, { status: 204, headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the status is 204 even though Content-Type says JSON', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<null>('https://api.example.com/items/1', { method: 'DELETE' });

        expect(data).toBeNull();
    });
});
