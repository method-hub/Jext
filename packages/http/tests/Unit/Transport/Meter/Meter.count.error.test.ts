import { describe, expect, it, vi } from 'vitest';
import Meter from '@Http/Transport/Meter';

describe('Meter.count should pass on the error of the source', () => {
    it('when the source stream fails', async () => {
        const source = new ReadableStream<Uint8Array>({
            pull(controller): void {
                controller.error(new TypeError('terminated'));
            },
        });

        const reading = new Response(Meter.count(source, null, vi.fn())).text();

        await expect(reading).rejects.toHaveProperty('name', 'TypeError');
    });
});
