import { describe, expect, it, vi } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.count should not call the listener', () => {
    it('when nobody reads the body', () => {
        const listener = vi.fn();
        const source = new Response('hello').body;

        Meter.count(source, 5, listener);

        expect(listener).not.toHaveBeenCalled();
    });
});
