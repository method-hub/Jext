import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.headers should add Last-Event-ID', () => {
    it('when an event with an id was seen', () => {
        const reconnection = new Reconnection(1);
        reconnection.seen({ event: 'message', data: 'a', id: '7', retry: null });

        const headers = reconnection.headers({ Authorization: 'Bearer t' });

        expect(headers.get('Last-Event-ID')).toBe('7');
        expect(headers.get('Authorization')).toBe('Bearer t');
    });
});
