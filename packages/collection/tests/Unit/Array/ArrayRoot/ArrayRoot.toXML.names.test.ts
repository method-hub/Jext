import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toXML should use the given element names', () => {
    it('when the root and item names are given', () => {
        const sut = ArrayExtensions.of<{ id: number }>([{ id: 1 }]);

        const result = sut.toXML('users', 'user');

        expect(result).toEqual('<users><user><id>1</id></user></users>');
    });
});
