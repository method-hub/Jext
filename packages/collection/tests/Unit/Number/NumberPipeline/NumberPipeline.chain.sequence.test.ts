import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.chain should return the NumberExtensions built in the callback', () => {
    it('when the callback chains several methods', () => {
        const utils = NumberExtensions.of(3);

        const result = utils.chain((ext) => {
            const tripled = ext.get() * 3;

            return NumberExtensions.of(tripled + 1);
        });

        expect(result.get()).toBe(10);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
