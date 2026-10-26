import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.wait should wait as long as Retry-After says', () => {
    it('when Retry-After is a number of seconds', () => {
        const policy = new RetryPolicy(2, 'GET');
        const response = new Response(null, { status: 429, headers: { 'Retry-After': '2' } });

        const wait = policy.wait(1, response);

        expect(wait).toBe(2000);
    });
});
