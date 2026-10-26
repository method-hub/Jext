import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should build the query and decode the answer', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(new Response('[{"id":1}]', { headers: { 'Content-Type': 'application/json' } }))
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when query parameters are chained', async () => {
        const http = new Bootstrap().init();

        const { data } = await http
            .get<Array<{ id: number }>>('https://api.example.com/users')
            .query({ tags: ['a', 'b'], page: 2 });

        expect(fetch).toHaveBeenCalledWith('https://api.example.com/users?tags=a&tags=b&page=2', expect.anything());
        expect(data).toEqual([{ id: 1 }]);
    });
});
