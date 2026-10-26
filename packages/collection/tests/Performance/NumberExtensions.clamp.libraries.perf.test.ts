import { describe, expect, it } from 'vitest';
import { Bench } from 'tinybench';
import lodash from 'lodash';
import * as toolkit from 'es-toolkit';
import * as remeda from 'remeda';
import * as ramda from 'ramda';
import NumberExtensions from '@Collection/Number/NumberExtensions';
import { clamp } from '@Collection/Number/extensions';

/**
 * Performance tests measure, they do not gate CI: timings on shared runners are noisy.
 * Run them with `npm run tests:performance` and compare jext with the libraries in the logged table.
 * Every variant must return the same value, so a faster variant cannot win by doing less work.
 */
const SIZES = [10, 1_000, 100_000, 1_000_000];

describe('clamp should be measured against FP libraries', () => {
    it.each(SIZES)(
        'when %i numbers are clamped',
        async (size) => {
            const middle = size / 2;
            const array = Array.from({ length: size }, (_item, index) => index - middle);
            const variants: Record<string, () => unknown> = {
                jext_function: () => array.map((value) => clamp(value, 0, 100)),
                jext_wrapper: () => array.map((value) => NumberExtensions.of(value).clamp(0, 100).get()),
                lodash: () => array.map((value) => lodash.clamp(value, 0, 100)),
                toolkit: () => array.map((value) => toolkit.clamp(value, 0, 100)),
                remeda: () => array.map((value) => remeda.clamp(value, { min: 0, max: 100 })),
                ramda: () => array.map((value) => ramda.clamp(0, 100, value)),
            };
            const title = `clamp, ${size}`;
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
