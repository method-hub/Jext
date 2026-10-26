import { describe, expect, it, vi } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should start a request for each key', () => {
    it('when two callers send different keys at the same time', async () => {
        const inflight = new Inflight();
        const start = vi.fn((_signal: AbortSignal) => Promise.resolve(new Response('ok')));

        await Promise.all([inflight.send('a', null, start), inflight.send('b', null, start)]);

        expect(start).toHaveBeenCalledTimes(2);
    });
});
