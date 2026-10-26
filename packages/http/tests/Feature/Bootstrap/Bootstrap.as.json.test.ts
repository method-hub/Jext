import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should decode JSON chosen with as', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'text/plain' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server sends JSON as text/plain', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<{ id: number }>('https://api.example.com/users/1').as('json');

        expect(data).toEqual({ id: 1 });
    });
});
