import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return an image as a Blob', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(new Uint8Array([137, 80, 78, 71]), { headers: { 'Content-Type': 'image/png' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is image/png', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<Blob>('https://api.example.com/logo.png');

        expect(data).toBeInstanceOf(Blob);
        expect(data.type).toBe('image/png');
    });
});
