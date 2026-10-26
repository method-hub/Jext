import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.allows should forbid the reconnect after the limit', () => {
    it('when two reconnects in a row are allowed and two were made', async () => {
        const reconnection = new Reconnection({ retries: 2, delay: 0 });
        await reconnection.wait(null);
        const second = reconnection.allows();
        await reconnection.wait(null);

        const third = reconnection.allows();

        expect(second).toBe(true);
        expect(third).toBe(false);
    });
});
