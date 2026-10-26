// @vitest-environment jsdom-with-fetch

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should decode the error body into error.data', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('<html><body><h1>Internal Server Error</h1></body></html>', {
                status: 500,
                headers: { 'Content-Type': 'text/html' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers 500 with an HTML page', async () => {
        const http = new Bootstrap().init();

        const { error } = await http.send<unknown, Document>('https://api.example.com/users');

        expect(error?.status).toBe(500);
        expect(error?.data?.querySelector('h1')?.textContent).toBe('Internal Server Error');
    });
});
