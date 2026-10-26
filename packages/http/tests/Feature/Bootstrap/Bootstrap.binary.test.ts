import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return binary data as an ArrayBuffer', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(new Uint8Array([0, 1, 2]), { headers: { 'Content-Type': 'application/octet-stream' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is application/octet-stream', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<ArrayBuffer>('https://api.example.com/file.bin');

        expect([...new Uint8Array(data)]).toEqual([0, 1, 2]);
    });
});
