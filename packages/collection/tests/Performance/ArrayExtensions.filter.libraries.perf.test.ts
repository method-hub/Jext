import { describe, expect, it } from 'vitest';
import { Bench } from 'tinybench';
import lodash from 'lodash';
import * as compat from 'es-toolkit/compat';
import * as remeda from 'remeda';
import * as ramda from 'ramda';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

/**
 * Performance tests measure, they do not gate CI: timings on shared runners are noisy.
 * Run them with `npm run tests:performance` and compare jext with the libraries in the logged table.
 * Every variant must return the same value, so a faster variant cannot win by doing less work.
 */
const SIZES = [10, 1_000, 100_000, 1_000_000];

describe('ArrayExtensions.filter should be measured against FP libraries', () => {
    it.each(SIZES)(
        'when the array has %i items',
        async (size) => {
            const array = Array.from({ length: size }, (_item, index) => index);
            const even = (item: number): boolean => item % 2 === 0;
            const variants: Record<string, () => unknown> = {
                native: () => array.filter(even),
                jext: () => ArrayExtensions.of<number>(array).filter(even).get(),
                lodash: () => lodash.filter(array, even),
                toolkit: () => compat.filter(array, even),
                remeda: () => remeda.filter(array, even),
                ramda: () => ramda.filter(even, array),
            };
            const title = `filter, ${size}`;
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
