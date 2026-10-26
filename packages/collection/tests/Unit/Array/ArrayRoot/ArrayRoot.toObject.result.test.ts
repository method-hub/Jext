import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ArrayRoot.toObject should key the elements by index', () => {
    it('when the array holds strings', () => {
        const sut = ArrayExtensions.of<string>(['a', 'b']);

        const result = sut.toObject();

        expect(result.get()).toEqual({ 0: 'a', 1: 'b' });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
