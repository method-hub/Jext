import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should decode the error body into error.data', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"title":"Invalid email","status":422}', {
                status: 422,
                headers: { 'Content-Type': 'application/problem+json' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers 422 with application/problem+json', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.send<{ id: number }, { title: string; status: number }>(
            'https://api.example.com/users'
        );

        expect(data).toBeNull();
        expect(error?.status).toBe(422);
        expect(error?.data).toEqual({ title: 'Invalid email', status: 422 });
    });
});
