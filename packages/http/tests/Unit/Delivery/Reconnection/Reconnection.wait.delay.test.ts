import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.wait should resolve with true after the delay', () => {
    beforeEach(() => vi.useFakeTimers());

    afterEach(() => vi.useRealTimers());

    it('when no retry field came from the server', async () => {
        const reconnection = new Reconnection({ delay: 500 });
        const listener = vi.fn<(...args: [boolean]) => unknown>();

        void reconnection.wait(null).then(listener);
        await vi.advanceTimersByTimeAsync(499);
        const early = listener.mock.calls.length;
        await vi.advanceTimersByTimeAsync(1);

        expect(early).toBe(0);
        expect(listener).toHaveBeenCalledWith(true);
    });
});
