import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import HttpError from '@Http/Error/HttpError';

describe('Bootstrap chain should return an HttpError', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is application/json and the body is not JSON', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.send<{ id: number }>('https://api.example.com/data');
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(200);
        expect(error?.cause).toHaveProperty('name', 'SyntaxError');
    });
});
