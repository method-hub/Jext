import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.omit should copy the object unchanged', () => {
    it('when the key is missing', () => {
        const sut = ObjectExtensions.of<{ a: number; b?: number }>({ a: 1 });

        const result = sut.omit(['b']);

        expect(result.get()).toEqual({ a: 1 });
    });
});
