import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toXML should escape special characters', () => {
    it('when the string holds markup', () => {
        const sut = StringExtensions.of('a & <b>');

        const result = sut.toXML('text');

        expect(result).toEqual('<text>a &amp; &lt;b&gt;</text>');
    });
});
