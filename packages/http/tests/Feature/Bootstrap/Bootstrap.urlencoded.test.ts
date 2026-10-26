import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return URLSearchParams', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('name=Alice', { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is application/x-www-form-urlencoded', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<URLSearchParams>('https://api.example.com/encoded');

        expect(data.get('name')).toBe('Alice');
    });
});
