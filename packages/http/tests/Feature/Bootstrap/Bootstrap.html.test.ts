// @vitest-environment jsdom-with-fetch

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return a Document', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('<html lang="en"><body><p>Hello</p></body></html>', {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is text/html', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<Document>('https://api.example.com/page');

        expect(data.querySelector('p')?.textContent).toBe('Hello');
    });
});
