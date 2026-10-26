import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return FormData', () => {
    beforeEach(() => {
        const form = new FormData();
        form.append('name', 'Alice');
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(form));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is multipart/form-data', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<FormData>('https://api.example.com/multipart');

        expect(data.get('name')).toBe('Alice');
    });
});
