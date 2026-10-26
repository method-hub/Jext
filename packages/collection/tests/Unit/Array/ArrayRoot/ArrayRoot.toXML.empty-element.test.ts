import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toXML should write an empty element', () => {
    it('when an element is null', () => {
        const sut = ArrayExtensions.of<number | null>([null]);

        const result = sut.toXML();

        expect(result).toEqual('<items><item/></items>');
    });
});
