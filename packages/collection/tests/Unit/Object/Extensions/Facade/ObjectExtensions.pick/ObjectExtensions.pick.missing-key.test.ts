import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectExtensions.pick should skip keys the object does not have', () => {
    it('when an optional key is missing', () => {
        const sut = ObjectExtensions.of<{ a: number; b?: number }>({ a: 1 });

        const result = sut.pick(['a', 'b']);

        expect(result.get()).toEqual({ a: 1 });
        expect(Object.keys(result.get())).toEqual(['a']);
    });
});
