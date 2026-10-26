import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayPipeline.up should collect results of any type', () => {
    it('when the callbacks return numbers and strings', () => {
        const sut = ArrayExtensions.of<number>([3, 1, 2]);

        const result = sut.up<number | string>([(array) => array.length, (array) => array.join('')]);

        expect(result.get()).toEqual([3, '312']);
    });
});
