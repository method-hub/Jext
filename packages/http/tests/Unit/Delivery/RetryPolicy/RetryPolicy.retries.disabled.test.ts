import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';
import type { Retry } from '@Http/Contract/RetryOptions';

describe('RetryPolicy.retries should never repeat the attempt', () => {
    it.each<[string, Retry | undefined]>([
        // eslint-disable-next-line no-undefined -- a missing option is the input under test
        ['no retry', undefined],
        ['retry 0', 0],
        ['a negative limit', -1],
        ['limit 0', { limit: 0 }],
    ])('when it is built with %s', (_name, retry) => {
        const policy = new RetryPolicy(retry, 'GET');

        const repeated = policy.retries(1, new Response(null, { status: 503 }));

        expect(repeated).toBe(false);
    });
});
