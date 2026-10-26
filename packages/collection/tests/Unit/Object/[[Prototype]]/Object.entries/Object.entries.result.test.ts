import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.entries should behave like the native Object.entries', () => {
    it('when the object has keys', () => {
        const object = { a: 1, b: 2 };
        const sut = ObjectExtensions.of<{ a: number; b: number }>(object);

        const result = sut.entries();

        expect(result.get()).toEqual(Object.entries(object));
    });
});
