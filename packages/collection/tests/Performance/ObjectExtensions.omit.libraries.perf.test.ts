import { describe, expect, it } from 'vitest';
import { Bench } from 'tinybench';
import lodash from 'lodash';
import * as toolkit from 'es-toolkit';
import * as remeda from 'remeda';
import * as ramda from 'ramda';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

/**
 * Performance tests measure, they do not gate CI: timings on shared runners are noisy.
 * Run them with `npm run tests:performance` and compare jext with the libraries in the logged table.
 * Every variant must return the same value, so a faster variant cannot win by doing less work.
 */
const SIZES = [10, 1_000, 100_000];

describe('ObjectExtensions.omit should be measured against FP libraries', () => {
    it.each(SIZES)(
        'when the object has %i keys and half of them are left out',
        async (size) => {
            const object: Record<string, number> = Object.fromEntries(
                Array.from({ length: size }, (_item, index) => [`key${index}`, index])
            );
            const keys = Object.keys(object).filter((_key, index) => index % 2 === 0);
            const variants: Record<string, () => unknown> = {
                jext: () => ObjectExtensions.of<Record<string, number>>(object).omit(keys).get(),
                lodash: () => lodash.omit(object, keys),
                toolkit: () => toolkit.omit(object, keys),
                remeda: () => remeda.omit(object, keys),
                ramda: () => ramda.omit(keys, object),
            };
            const title = `omit half of the keys, ${size}`;
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
