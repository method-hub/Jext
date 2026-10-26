import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.pick should keep the original object', () => {
    it('when keys are dropped', () => {
        const original = { a: 1, b: 2, c: 3 };
        const sut = ObjectExtensions.of<{ a: number; b: number; c: number }>(original);

        sut.pick(['a']);

        expect(original).toEqual({ a: 1, b: 2, c: 3 });
    });
});
