import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.map should behave like the native Array.prototype.map', () => {
    it('when the array holds numbers', () => {
        const array = [1, 2, 3];
        const sut = new ArrayExtensions(array);

        const jextResult = sut.map((x) => x * 2);
        const classicResult = array.map((x) => x * 2);

        expect(jextResult.get()).toEqual(classicResult);
    });
});
