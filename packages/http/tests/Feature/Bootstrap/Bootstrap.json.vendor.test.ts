import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return parsed JSON', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'application/vnd.api+json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is a vendor +json type', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<{ id: number }>('https://api.example.com/data');

        expect(data).toEqual({ id: 1 });
    });
});
