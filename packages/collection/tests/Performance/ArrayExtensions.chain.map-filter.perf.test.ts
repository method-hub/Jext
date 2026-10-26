import { describe, expect, it } from 'vitest';
import { Bench } from 'tinybench';
import lodash from 'lodash';
import * as remeda from 'remeda';
import * as ramda from 'ramda';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

/**
 * Performance tests measure, they do not gate CI: timings on shared runners are noisy.
 * Run them with `npm run tests:performance` and compare jext with the libraries in the logged table.
 * Every variant must return the same value, so a faster variant cannot win by doing less work.
 */
const SIZES = [10, 1_000, 100_000, 1_000_000];

describe('ArrayExtensions chain of map and filter should be measured against FP libraries', () => {
    it.each(SIZES)(
        'when the array has %i items',
        async (size) => {
            const array = Array.from({ length: size }, (_item, index) => index);
            const double = (item: number): number => item * 2;
            const third = (item: number): boolean => item % 3 === 0;
            const ramdaPipe = ramda.pipe(ramda.map(double), ramda.filter(third));
            const variants: Record<string, () => unknown> = {
                native: () => array.map(double).filter(third),
                jext: () => ArrayExtensions.of<number>(array).map(double).filter(third).get(),
                lodash: () => lodash.chain(array).map(double).filter(third).value(),
                remeda: () => remeda.pipe(array, remeda.map(double), remeda.filter(third)),
                ramda: () => ramdaPipe(array),
            };
            const title = `map → filter, ${size}`;
            const bench = new Bench({ time: size >= 1_000_000 ? 1_000 : 300, iterations: 5 });

            for (const [name, run] of Object.entries(variants)) {
                bench.add(name, run);
            }
            await bench.run();
            console.info(title);
            console.table(bench.table());

            const results = Object.values(variants).map((run) => run());
            for (const result of results) {
                expect(result).toEqual(results[0]);
            }
        },
        120_000
    );
});
