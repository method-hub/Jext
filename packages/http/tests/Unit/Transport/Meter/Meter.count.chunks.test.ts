import { describe, expect, it } from 'vitest';
import Meter from '@Http/Transport/Meter';
import type { Progress } from '@Http/Contract/Progress';

describe('Meter.count should report the bytes after every chunk and keep them unchanged', () => {
    it('when a body of three chunks is read', async () => {
        const reports: Progress[] = [];
        const source = new ReadableStream<Uint8Array>({
            start(controller): void {
                [[1, 2], [3, 4], [5]].forEach((bytes) => controller.enqueue(new Uint8Array(bytes)));
                controller.close();
            },
        });

        const bytes = await new Response(Meter.count(source, 5, (progress) => reports.push(progress))).arrayBuffer();

        expect([...new Uint8Array(bytes)]).toEqual([1, 2, 3, 4, 5]);
        expect(reports).toEqual([
            { loaded: 2, total: 5, percent: 40 },
            { loaded: 4, total: 5, percent: 80 },
            { loaded: 5, total: 5, percent: 100 },
        ]);
    });
});
