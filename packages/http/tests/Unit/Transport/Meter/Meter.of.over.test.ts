import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.of should not go above 100 percent', () => {
    it('when more bytes arrive than the total said', () => {
        const progress = Meter.of(300, 200);

        expect(progress.percent).toBe(100);
    });
});
