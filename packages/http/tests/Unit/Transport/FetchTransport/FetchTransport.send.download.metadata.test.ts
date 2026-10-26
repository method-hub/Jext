import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FetchTransport from '@Http/Transport/FetchTransport';

describe('FetchTransport.send should keep the status, status text and headers', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('gone', { status: 410, statusText: 'Gone', headers: { 'X-Id': '7' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the body is wrapped for counting', async () => {
        const response = await new FetchTransport(vi.fn()).send('/x', {});

        expect(response.status).toBe(410);
        expect(response.statusText).toBe('Gone');
        expect(response.headers.get('X-Id')).toBe('7');
    });
});
