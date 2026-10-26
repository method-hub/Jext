import { describe, expect, it } from 'vitest';
import { Bench } from 'tinybench';
import lodash from 'lodash';
import * as toolkit from 'es-toolkit';
import * as remeda from 'remeda';
import * as ramda from 'ramda';
import { unique } from '@Collection/Array/extensions';

/**
 * Performance tests measure, they do not gate CI: timings on shared runners are noisy.
 * Run them with `npm run tests:performance` and compare jext with the libraries in the logged table.
 * Every variant must return the same value, so a faster variant cannot win by doing less work.
 */
const SIZES = [10, 1_000, 100_000, 1_000_000];

describe('unique should be measured against FP libraries', () => {
    it.each(SIZES)(
        'when the array has %i items with repeats',
        async (size) => {
            const array = Array.from({ length: size }, (_item, index) => index % 100);
            const variants: Record<string, () => unknown> = {
                jext: () => unique<number>(array),
                lodash: () => lodash.uniq(array),
                'es-toolkit': () => toolkit.uniq(array),
                remeda: () => remeda.unique(array),
                ramda: () => ramda.uniq(array),
            };
            const title = `unique, ${size}`;
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
