import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.wait should wait 1000 ms', () => {
    beforeEach(() => vi.useFakeTimers());

    afterEach(() => vi.useRealTimers());

    it('when no delay is given', async () => {
        const reconnection = new Reconnection(1);
        const listener = vi.fn<(...args: [boolean]) => unknown>();

        void reconnection.wait(null).then(listener);
        await vi.advanceTimersByTimeAsync(999);
        const early = listener.mock.calls.length;
        await vi.advanceTimersByTimeAsync(1);

        expect(early).toBe(0);
        expect(listener).toHaveBeenCalledWith(true);
    });
});
