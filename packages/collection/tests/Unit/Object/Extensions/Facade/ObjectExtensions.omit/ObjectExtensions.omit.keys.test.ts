import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.omit should leave out the given keys', () => {
    it('when the keys exist', () => {
        const sut = ObjectExtensions.of<{ a: number; b: number; c: number }>({ a: 1, b: 2, c: 3 });

        const result = sut.omit(['b']);

        expect(result.get()).toEqual({ a: 1, c: 3 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
