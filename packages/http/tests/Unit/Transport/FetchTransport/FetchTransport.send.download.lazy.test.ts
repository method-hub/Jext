import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FetchTransport from '@Http/Transport/FetchTransport';

describe('FetchTransport.send should not report progress before the body is read', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('hello', { headers: { 'Content-Length': '5' } }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when only the response object is received', async () => {
        const listener = vi.fn();

        await new FetchTransport(listener).send('/x', {});

        expect(listener).not.toHaveBeenCalled();
    });
});
