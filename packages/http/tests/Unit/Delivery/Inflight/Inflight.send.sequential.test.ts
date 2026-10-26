import { describe, expect, it, vi } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should start the request again', () => {
    it('when the first request has already been answered', async () => {
        const inflight = new Inflight();
        const start = vi.fn((_signal: AbortSignal) => Promise.resolve(new Response('ok')));
        await inflight.send('k', null, start);

        await inflight.send('k', null, start);

        expect(start).toHaveBeenCalledTimes(2);
    });
});
