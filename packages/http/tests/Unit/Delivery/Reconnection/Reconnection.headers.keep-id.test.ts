import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.headers should keep the last id', () => {
    it('when an event of the new connection comes without an id', () => {
        const reconnection = new Reconnection(1);
        reconnection.seen({ event: 'message', data: 'a', id: '7', retry: null });
        reconnection.seen({ event: 'message', data: 'b', id: '', retry: null });

        const headers = reconnection.headers({});

        expect(headers.get('Last-Event-ID')).toBe('7');
    });
});
