import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should return an error for a body that is not in the chosen format', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('<html><body>Login</body></html>', { headers: { 'Content-Type': 'text/html' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when json is chosen and the server sends HTML', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.get<{ id: number }>('https://api.example.com/users/1').as('json');

        expect(data).toBeNull();
        expect(error?.message).toBe('The response body could not be decoded');
        expect(error?.cause).toHaveProperty('name', 'SyntaxError');
    });
});
