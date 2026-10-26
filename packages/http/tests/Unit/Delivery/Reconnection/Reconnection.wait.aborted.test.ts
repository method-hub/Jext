import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.wait should resolve with false', () => {
    beforeEach(() => vi.useFakeTimers());

    afterEach(() => vi.useRealTimers());

    it('when the signal aborts during the wait', async () => {
        const reconnection = new Reconnection({ delay: 5000 });
        const controller = new AbortController();
        const waiting = reconnection.wait(controller.signal);

        controller.abort();

        await expect(waiting).resolves.toBe(false);
    });
});
