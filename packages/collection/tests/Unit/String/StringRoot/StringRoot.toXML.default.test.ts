import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toXML should write one value element', () => {
    it('when no tag is given', () => {
        const sut = StringExtensions.of('abc');

        const result = sut.toXML();

        expect(result).toEqual('<value>abc</value>');
    });
});
