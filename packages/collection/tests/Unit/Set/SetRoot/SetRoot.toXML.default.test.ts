import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetRoot.toXML should write one item element per value', () => {
    it('when no names are given', () => {
        const sut = SetExtensions.of<string>(new Set(['a']));

        const result = sut.toXML();

        expect(result).toEqual('<items><item>a</item></items>');
    });
});
