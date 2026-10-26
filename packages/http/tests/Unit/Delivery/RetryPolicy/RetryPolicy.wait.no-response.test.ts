import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.wait should use the delay', () => {
    it('when the attempt got no response', () => {
        const policy = new RetryPolicy({ limit: 2, delay: 50 }, 'GET');

        const wait = policy.wait(1, null);

        expect(wait).toBe(50);
    });
});
