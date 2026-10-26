import { describe, expect, it } from 'vitest';
import RetryPolicy from '@Http/Delivery/RetryPolicy';

describe('RetryPolicy.wait should double the delay before each repeat', () => {
    it.each<[number | undefined, number[]]>([
        // eslint-disable-next-line no-undefined -- a missing option is the input under test
        [undefined, [300, 600, 1200]],
        [100, [100, 200, 400]],
        [0, [0, 0, 0]],
    ])('when the first delay is %p', (delay, expected) => {
        const policy = new RetryPolicy({ limit: 3, delay }, 'GET');

        const waits = [1, 2, 3].map((attempt) => policy.wait(attempt, new Response(null, { status: 503 })));

        expect(waits).toEqual(expected);
    });
});
