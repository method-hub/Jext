import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return parsed JSON', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new TextEncoder().encode('{"id":1}')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is missing and the body is JSON', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<{ id: number }>('https://api.example.com/legacy');

        expect(data).toEqual({ id: 1 });
    });
});
