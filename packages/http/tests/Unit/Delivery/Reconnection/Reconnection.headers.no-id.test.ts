import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.headers should not add Last-Event-ID', () => {
    it('when no event had an id', () => {
        const reconnection = new Reconnection(1);
        reconnection.seen({ event: 'message', data: 'a', id: '', retry: null });

        const headers = reconnection.headers({});

        expect(headers.has('Last-Event-ID')).toBe(false);
    });
});
