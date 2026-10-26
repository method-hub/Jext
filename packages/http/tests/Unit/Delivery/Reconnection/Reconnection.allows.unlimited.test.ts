import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.allows should allow reconnecting without a limit', () => {
    it('when it is built with options without retries', async () => {
        const reconnection = new Reconnection({ delay: 0 });
        for (let count = 0; count < 20; count += 1) {
            await reconnection.wait(null);
        }

        const allowed = reconnection.allows();

        expect(allowed).toBe(true);
    });
});
