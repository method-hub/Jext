import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayExtensions.map should behave like the native Array.prototype.map', () => {
    it('when the array holds objects', () => {
        const array = [{ val: 1 }, { val: 2 }, { val: 3 }];
        const sut = new ArrayExtensions(array);

        const jextResult = sut.map((x) => ({ val: x.val * 2 }));
        const classicResult = array.map((x) => ({ val: x.val * 2 }));

        expect(jextResult.get()).toEqual(classicResult);
    });
});
