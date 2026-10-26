import { describe, expect, it } from 'vitest';
import Inflight from '@Http/Delivery/Inflight';

describe('Inflight.key should give different keys', () => {
    it('when the URLs differ only in the query', () => {
        const first = Inflight.key('https://api.example.com/users?page=1', {});

        const second = Inflight.key('https://api.example.com/users?page=2', {});

        expect(second).not.toBe(first);
    });
});
