import { describe, expect, it, vi } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should start a new request', () => {
    it('when a caller comes after every caller of the old one aborted', async () => {
        const inflight = new Inflight();
        const start = vi
            .fn((_signal: AbortSignal) => Promise.resolve(new Response('fresh')))
            .mockImplementationOnce(() => new Promise<Response>(() => {}));
        const controller = new AbortController();
        const first = inflight.send('k', controller.signal, start);
        controller.abort();
        await expect(first).rejects.toHaveProperty('name', 'AbortError');

        const second = await inflight.send('k', null, start);

        expect(start).toHaveBeenCalledTimes(2);
        expect(await second.text()).toBe('fresh');
    });
});
