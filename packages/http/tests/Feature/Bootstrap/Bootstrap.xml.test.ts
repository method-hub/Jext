import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return XML as an object', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('<root><id>1</id></root>', { headers: { 'Content-Type': 'application/xml' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is application/xml', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<{ root: { id: number } }>('https://api.example.com/data.xml');

        expect(data).toEqual({ root: { id: 1 } });
    });
});
