import { describe, expect, it } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.key should give the same key', () => {
    it('when the same headers are written in another order and case', () => {
        const first = Inflight.key('https://api.example.com/users', { headers: { 'X-A': '1', Accept: 'json' } });

        const second = Inflight.key('https://api.example.com/users', {
            method: 'get',
            headers: [
                ['accept', 'json'],
                ['x-a', '1'],
            ],
        });

        expect(second).toBe(first);
    });
});
