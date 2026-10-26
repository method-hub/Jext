import { describe, expect, it, vi } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should start the request once and give each caller its own body', () => {
    it('when two callers send the same key at the same time', async () => {
        const inflight = new Inflight();
        const start = vi.fn((_signal: AbortSignal) => Promise.resolve(new Response('shared')));

        const [first, second] = await Promise.all([inflight.send('k', null, start), inflight.send('k', null, start)]);

        expect(start).toHaveBeenCalledTimes(1);
        expect(first).not.toBe(second);
        expect(await first.text()).toBe('shared');
        expect(await second.text()).toBe('shared');
    });
});
