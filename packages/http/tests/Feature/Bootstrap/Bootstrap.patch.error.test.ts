import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return the decoded error body', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"field":"email"}', { status: 422, headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a PATCH request is rejected with 422', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http
            .patch<{ id: number }, { field: string }>('https://api.example.com/users/7')
            .body({ email: 'x' });

        expect(data).toBeNull();
        expect(error?.status).toBe(422);
        expect(error?.data).toEqual({ field: 'email' });
    });
});
