import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ObjectExtensions.keys should behave like the native Object.keys', () => {
    it('when the object has keys', () => {
        const object = { a: 1, b: 2 };
        const sut = ObjectExtensions.of<{ a: number; b: number }>(object);

        const result = sut.keys();

        expect(result.get()).toEqual(Object.keys(object));
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
