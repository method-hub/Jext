import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return NDJSON as an array, not as the object itself', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'application/x-ndjson' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the body has a single line', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<Array<{ id: number }>>('https://api.example.com/events');

        expect(data).toEqual([{ id: 1 }]);
    });
});
