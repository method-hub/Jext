import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.up should pass each callback its own copy', () => {
    it('when a callback mutates its array', () => {
        const utils = ArrayExtensions.of([10, 20, 30]);

        const result = utils.up([(arr) => arr.map((x) => x / 10), (arr) => arr.reverse()]);

        expect(result.get()[0]).toEqual([1, 2, 3]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
