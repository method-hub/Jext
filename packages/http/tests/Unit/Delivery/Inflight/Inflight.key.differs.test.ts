import { describe, expect, it } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.key should give different keys', () => {
    it.each([
        ['the method', { method: 'HEAD' }],
        ['a header', { headers: { Authorization: 'Bearer other' } }],
    ])('when %s differs', (_name, init: RequestInit) => {
        const base = Inflight.key('https://api.example.com/users', { headers: { Authorization: 'Bearer t' } });

        const other = Inflight.key('https://api.example.com/users', init);

        expect(other).not.toBe(base);
    });
});
