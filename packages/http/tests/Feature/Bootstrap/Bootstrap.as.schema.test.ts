import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

const Ids: StandardSchema<unknown, number[]> = {
    '~standard': {
        version: 1,
        vendor: 'test',
        validate: (value) => ({ value: (value as string[][]).slice(1).map(([id]) => Number(id)) }),
    },
};

describe('Bootstrap client should validate the data decoded in the chosen format', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('id\n1\n2', { headers: { 'Content-Type': 'text/plain' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when as and schema are chained', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<unknown>('https://api.example.com/ids').as('csv').schema(Ids);

        expect(data).toEqual([1, 2]);
    });
});
