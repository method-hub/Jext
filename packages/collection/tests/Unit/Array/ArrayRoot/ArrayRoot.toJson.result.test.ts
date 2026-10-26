import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toJson should serialize the array', () => {
    it('when it holds primitives and objects', () => {
        const sut = ArrayExtensions.of<number | string | { id: number }>([1, 'a', { id: 2 }]);

        const result = sut.toJson();

        expect(result).toEqual('[1,"a",{"id":2}]');
    });
});
