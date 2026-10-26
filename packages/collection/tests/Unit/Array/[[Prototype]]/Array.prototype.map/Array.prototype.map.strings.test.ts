import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.map should behave like the native Array.prototype.map', () => {
    it('when the array holds strings', () => {
        const array = ['a', 'b', 'c'];
        const sut = new ArrayExtensions(array);

        const jextResult = sut.map((x) => x.toUpperCase());
        const classicResult = array.map((x) => x.toUpperCase());

        expect(jextResult.get()).toEqual(classicResult);
    });
});
