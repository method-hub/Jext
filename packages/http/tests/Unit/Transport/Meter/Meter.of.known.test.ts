import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.of should give the whole percent of the total', () => {
    it.each([
        [0, 200, 0],
        [50, 200, 25],
        [199, 200, 99],
        [200, 200, 100],
    ])('when %i of %i bytes are done', (loaded, total, percent) => {
        const progress = Meter.of(loaded, total);

        expect(progress).toEqual({ loaded, total, percent });
    });
});
