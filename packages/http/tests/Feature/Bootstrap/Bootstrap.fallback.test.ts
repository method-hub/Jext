import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return an ArrayBuffer', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(new Uint8Array([1]), { headers: { 'Content-Type': 'application/x-unknown' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when no parser knows the Content-Type', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<ArrayBuffer>('https://api.example.com/unknown');

        expect(data).toBeInstanceOf(ArrayBuffer);
    });
});
