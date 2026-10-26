import { describe, expect, it } from 'vitest';
import Reconnection from '@Http/Delivery/Reconnection';

describe('Reconnection.allows should forbid reconnecting', () => {
    it.each([
        ['no reconnect option', null],
        ['0', 0],
        ['retries 0', { retries: 0 }],
    ])('when it is built with %s', (_name, reconnect) => {
        const reconnection = new Reconnection(reconnect ?? 0);

        const allowed = reconnection.allows();

        expect(allowed).toBe(false);
    });
});
