import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should keep a number-like text body as a string', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('42', { headers: { 'Content-Type': 'text/plain' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is text/plain', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<string>('https://api.example.com/count');

        expect(data).toBe('42');
    });
});
