import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.seen should reset the count of reconnects in a row', () => {
    it('when an event arrives after the last allowed reconnect', async () => {
        const reconnection = new Reconnection({ retries: 1, delay: 0 });
        await reconnection.wait(null);

        reconnection.seen({ event: 'message', data: 'a', id: '', retry: null });

        expect(reconnection.allows()).toBe(true);
    });
});
