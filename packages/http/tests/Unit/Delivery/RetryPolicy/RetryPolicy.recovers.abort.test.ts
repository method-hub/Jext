import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.recovers should not repeat the attempt', () => {
    it.each(['AbortError', 'TimeoutError'])('when fetch failed with %s', (name) => {
        const policy = new RetryPolicy(2, 'GET');

        const repeated = policy.recovers(1, new DOMException('stopped', name));

        expect(repeated).toBe(false);
    });
});
