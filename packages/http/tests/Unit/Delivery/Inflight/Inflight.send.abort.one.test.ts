import { describe, expect, it } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should stop only the wait of the caller that aborted', () => {
    it('when one of two callers aborts before the response', async () => {
        const inflight = new Inflight();
        let respond: (response: Response) => void = () => {};
        let shared: AbortSignal | null = null;
        const start = (signal: AbortSignal): Promise<Response> => {
            shared = signal;
            return new Promise<Response>((resolve) => (respond = resolve));
        };
        const controller = new AbortController();
        const first = inflight.send('k', controller.signal, start);
        const second = inflight.send('k', null, start);

        controller.abort();
        respond(new Response('ok'));

        await expect(first).rejects.toHaveProperty('name', 'AbortError');
        expect(await (await second).text()).toBe('ok');
        expect(shared?.aborted).toBe(false);
    });
});
