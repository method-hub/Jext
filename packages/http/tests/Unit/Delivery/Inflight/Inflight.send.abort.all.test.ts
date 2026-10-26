import { describe, expect, it } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.send should abort the shared request', () => {
    it('when every caller aborts', async () => {
        const inflight = new Inflight();
        let shared: AbortSignal | null = null;
        const start = (signal: AbortSignal): Promise<Response> => {
            shared = signal;
            return new Promise<Response>(() => {});
        };
        const first = new AbortController();
        const second = new AbortController();
        const waits = [inflight.send('k', first.signal, start), inflight.send('k', second.signal, start)];

        first.abort();
        second.abort();

        const results = await Promise.allSettled(waits);
        expect(results.map(({ status }) => status)).toEqual(['rejected', 'rejected']);
        expect(shared?.aborted).toBe(true);
    });
});
