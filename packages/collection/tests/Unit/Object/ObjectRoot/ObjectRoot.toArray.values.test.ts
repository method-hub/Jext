import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ObjectRoot.toArray should collect the values', () => {
    it('when the object has keys', () => {
        const sut = ObjectExtensions.of<{ a: number; b: number }>({ a: 1, b: 2 });

        const result = sut.toArray();

        expect(result.get()).toEqual([1, 2]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
