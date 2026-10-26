import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return TSV as rows', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('id\tname\n1\tAlice', { headers: { 'Content-Type': 'text/tab-separated-values' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is text/tab-separated-values', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<string[][]>('https://api.example.com/data.tsv');

        expect(data).toEqual([
            ['id', 'name'],
            ['1', 'Alice'],
        ]);
    });
});
