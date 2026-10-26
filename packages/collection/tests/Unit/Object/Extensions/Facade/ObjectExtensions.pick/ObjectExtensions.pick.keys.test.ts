import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.pick should keep only the given keys', () => {
    it('when the keys exist', () => {
        const sut = ObjectExtensions.of<{ a: number; b: number; c: number }>({ a: 1, b: 2, c: 3 });

        const result = sut.pick(['a', 'c']);

        expect(result.get()).toEqual({ a: 1, c: 3 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
