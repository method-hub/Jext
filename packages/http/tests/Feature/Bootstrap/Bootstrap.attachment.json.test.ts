import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return parsed JSON', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', {
                headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when JSON is sent with Content-Disposition: attachment', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<{ id: number }>('https://api.example.com/export.json');

        expect(data).toEqual({ id: 1 });
    });
});
