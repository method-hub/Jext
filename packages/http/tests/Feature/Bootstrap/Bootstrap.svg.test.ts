import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return SVG as an XML object, not as an image', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('<svg width="10"></svg>', { headers: { 'Content-Type': 'image/svg+xml' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is image/svg+xml', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<{ svg: string }>('https://api.example.com/icon.svg');

        expect(data).toEqual({ svg: '' });
    });
});
