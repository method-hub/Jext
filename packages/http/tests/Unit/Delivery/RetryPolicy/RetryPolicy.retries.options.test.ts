import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.retries should use the given methods and statuses', () => {
    it('when the options replace the defaults', () => {
        const policy = new RetryPolicy({ limit: 1, methods: ['post'], statuses: [409] }, 'POST');

        const conflict = policy.retries(1, new Response(null, { status: 409 }));
        const unavailable = policy.retries(1, new Response(null, { status: 503 }));

        expect(conflict).toBe(true);
        expect(unavailable).toBe(false);
    });
});
