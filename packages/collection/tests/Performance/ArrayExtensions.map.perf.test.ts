import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

/**
 * Performance tests measure, they do not gate CI: timings on shared runners are noisy.
 * Run them with `npm run tests:performance` and compare the logged numbers between versions.
 */
const SIZE = 100_000;
const RUNS = 20;

const measure = (callback: () => void): number => {
    const start = performance.now();
    for (let run = 0; run < RUNS; run++) {
        callback();
    }
    return (performance.now() - start) / RUNS;
};

describe('ArrayExtensions.map performance', () => {
    it(`maps ${SIZE} items and reports the overhead against the native map`, () => {
        const array = Array.from({ length: SIZE }, (_, index) => index);
        const wrapped = ArrayExtensions.of(array);

        const native = measure(() => array.map((item) => item * 2));
        const jext = measure(() => wrapped.map((item) => item * 2));

        console.info(
            `native: ${native.toFixed(3)} ms, jext: ${jext.toFixed(3)} ms, ratio: ${(jext / native).toFixed(2)}`
        );

        expect(wrapped.map((item) => item * 2).get()).toEqual(array.map((item) => item * 2));
    });
});
