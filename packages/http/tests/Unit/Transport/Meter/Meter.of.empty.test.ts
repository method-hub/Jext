import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.of should report 100 percent', () => {
    it('when the body is empty', () => {
        const progress = Meter.of(0, 0);

        expect(progress).toEqual({ loaded: 0, total: 0, percent: 100 });
    });
});
