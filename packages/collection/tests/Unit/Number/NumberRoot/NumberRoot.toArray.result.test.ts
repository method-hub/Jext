import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('NumberRoot.toArray should put the number into an array wrapper', () => {
    it('when it is called', () => {
        const sut = NumberExtensions.of(7);

        const result = sut.toArray();

        expect(result.get()).toEqual([7]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
