import { describe, expect, it, vi } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.count should cancel the source', () => {
    it('when the counted stream is cancelled', async () => {
        const cancel = vi.fn();
        const source = new ReadableStream<Uint8Array>({ cancel });

        await Meter.count(source, null, vi.fn()).cancel('not needed');

        expect(cancel).toHaveBeenCalledWith('not needed');
    });
});
