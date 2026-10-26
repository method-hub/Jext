import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should decode CSV rows chosen with as', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('id,name\n1,Alice', { headers: { 'Content-Type': 'application/octet-stream' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server sends CSV as a binary stream', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<unknown>('https://api.example.com/report').as('csv');

        expect(data).toEqual([
            ['id', 'name'],
            ['1', 'Alice'],
        ]);
    });
});
