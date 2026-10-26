import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.total should read the size from Content-Length', () => {
    it.each([{}, { 'Content-Encoding': 'identity' }])('when the body is not compressed: %p', (encoding) => {
        const headers = new Headers({ 'Content-Length': '2048', ...encoding });

        const total = Meter.total(headers);

        expect(total).toBe(2048);
    });
});
