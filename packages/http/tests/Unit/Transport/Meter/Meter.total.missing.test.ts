import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.total should not know the size', () => {
    it.each([[{}], [{ 'Content-Length': 'abc' }], [{ 'Content-Length': '-1' }]])('when the headers are %p', (init) => {
        const total = Meter.total(new Headers(init));

        expect(total).toBeNull();
    });
});
