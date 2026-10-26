import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberPipeline.chain should return the NumberExtensions built in the callback', () => {
    it('when the callback wraps a new number', () => {
        const utils = NumberExtensions.of(5);

        const result = utils.chain((ext) => NumberExtensions.of(ext.get() * 2));

        expect(result.get()).toBe(10);
        expect(result).toBeInstanceOf(NumberExtensions);
    });
});
