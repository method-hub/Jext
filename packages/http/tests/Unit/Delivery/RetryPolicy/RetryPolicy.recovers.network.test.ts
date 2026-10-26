import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.recovers should repeat the attempt', () => {
    it('when fetch failed with a network error', () => {
        const policy = new RetryPolicy(1, 'GET');

        const repeated = policy.recovers(1, new TypeError('Failed to fetch'));

        expect(repeated).toBe(true);
    });
});
