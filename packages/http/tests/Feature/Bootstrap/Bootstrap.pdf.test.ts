import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return a PDF as a Blob', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('%PDF-1.4', { headers: { 'Content-Type': 'application/pdf' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is application/pdf', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<Blob>('https://api.example.com/document.pdf');

        expect(data).toBeInstanceOf(Blob);
    });
});
