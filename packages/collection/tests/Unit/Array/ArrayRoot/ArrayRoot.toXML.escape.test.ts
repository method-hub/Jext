import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toXML should escape special characters', () => {
    it('when an element holds markup', () => {
        const sut = ArrayExtensions.of<string>(['<b> & "q"']);

        const result = sut.toXML();

        expect(result).toEqual('<items><item>&lt;b&gt; &amp; &quot;q&quot;</item></items>');
    });
});
