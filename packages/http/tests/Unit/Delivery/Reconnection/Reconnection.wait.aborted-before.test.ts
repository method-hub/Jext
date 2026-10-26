import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.wait should resolve with false at once', () => {
    it('when the signal was aborted before the wait', async () => {
        const reconnection = new Reconnection({ delay: 60000 });
        const controller = new AbortController();
        controller.abort();

        const waiting = reconnection.wait(controller.signal);

        await expect(waiting).resolves.toBe(false);
    });
});
