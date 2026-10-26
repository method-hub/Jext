import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.wait should wait as long as the retry field says', () => {
    beforeEach(() => vi.useFakeTimers());

    afterEach(() => vi.useRealTimers());

    it('when the server sent retry: 50', async () => {
        const reconnection = new Reconnection({ delay: 5000 });
        reconnection.seen({ event: 'message', data: 'a', id: '', retry: 50 });
        const listener = vi.fn<(...args: [boolean]) => unknown>();

        void reconnection.wait(null).then(listener);
        await vi.advanceTimersByTimeAsync(50);

        expect(listener).toHaveBeenCalledWith(true);
    });
});
