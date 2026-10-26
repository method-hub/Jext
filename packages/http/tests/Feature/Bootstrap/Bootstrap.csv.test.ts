import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return CSV as rows', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('id,name\n1,Alice', { headers: { 'Content-Type': 'text/csv' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is text/csv', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<string[][]>('https://api.example.com/data.csv');

        expect(data).toEqual([
            ['id', 'name'],
            ['1', 'Alice'],
        ]);
    });
});
