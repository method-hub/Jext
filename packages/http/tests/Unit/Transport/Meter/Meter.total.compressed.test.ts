import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.total should not know the size', () => {
    it.each(['gzip', 'br', 'deflate'])('when the body is compressed with %s', (encoding) => {
        const headers = new Headers({ 'Content-Length': '100', 'Content-Encoding': encoding });

        const total = Meter.total(headers);

        expect(total).toBeNull();
    });
});
