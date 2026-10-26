import { describe, expect, it, vi } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should reject without starting the request', () => {
    it('when the signal of the caller was aborted before', async () => {
        const inflight = new Inflight();
        const start = vi.fn((_signal: AbortSignal) => Promise.resolve(new Response('ok')));
        const controller = new AbortController();
        controller.abort();

        const waiting = inflight.send('k', controller.signal, start);

        await expect(waiting).rejects.toHaveProperty('name', 'AbortError');
        expect(start).not.toHaveBeenCalled();
    });
});
