import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.omit should keep the original object', () => {
    it('when keys are left out', () => {
        const original = { a: 1, b: 2, c: 3 };
        const sut = ObjectExtensions.of<{ a: number; b: number; c: number }>(original);

        sut.omit(['a']);

        expect(original).toEqual({ a: 1, b: 2, c: 3 });
    });
});
