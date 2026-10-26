import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return a Blob chosen with as', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server sends application/json', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<unknown>('https://api.example.com/users/1').as('blob');

        expect(data?.type).toBe('application/json');
        expect(await data?.text()).toBe('{"id":1}');
    });
});
