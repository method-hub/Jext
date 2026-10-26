import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FetchTransport from '@Http/Transport/FetchTransport';

describe('FetchTransport.send should report a complete empty body once', () => {
    let response: Response;

    beforeEach(() => {
        response = new Response(null, { status: 204 });
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the response has no body', async () => {
        const listener = vi.fn();

        const received = await new FetchTransport(listener).send('/x', {});

        expect(received).toBe(response);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ loaded: 0, total: 0, percent: 100 });
    });
});
