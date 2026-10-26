import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return null', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the response has no body', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<null>('https://api.example.com/items/1', { method: 'HEAD' });

        expect(data).toBeNull();
    });
});
