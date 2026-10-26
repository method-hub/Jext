import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.of should give only the loaded bytes', () => {
    it('when the total is not known', () => {
        const progress = Meter.of(1024, null);

        expect(progress).toEqual({ loaded: 1024 });
    });
});
