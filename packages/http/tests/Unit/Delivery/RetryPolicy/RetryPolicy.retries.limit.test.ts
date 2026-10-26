import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.retries should stop after the limit', () => {
    it('when the attempt number is greater than the limit', () => {
        const policy = new RetryPolicy(2, 'GET');
        const response = new Response(null, { status: 503 });

        const repeated = [1, 2, 3].map((attempt) => policy.retries(attempt, response));

        expect(repeated).toEqual([true, true, false]);
    });
});
