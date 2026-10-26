import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toXML should throw TypeError', () => {
    it('when the tag is not a valid XML name', () => {
        const sut = StringExtensions.of('abc');

        const run = (): string => sut.toXML('a b');

        expect(run).toThrow(TypeError);
    });
});
