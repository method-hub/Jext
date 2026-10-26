import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toXML should write one item element per element', () => {
    it('when no names are given', () => {
        const sut = ArrayExtensions.of<number>([1, 2]);

        const result = sut.toXML();

        expect(result).toEqual('<items><item>1</item><item>2</item></items>');
    });
});
