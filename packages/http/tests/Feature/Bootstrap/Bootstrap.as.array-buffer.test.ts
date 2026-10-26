import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return the bytes chosen with as', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('abc', { headers: { 'Content-Type': 'text/plain' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server sends text', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<unknown>('https://api.example.com/file').as('arrayBuffer');

        expect([...new Uint8Array(data ?? new ArrayBuffer(0))]).toEqual([97, 98, 99]);
    });
});
