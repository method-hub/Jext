import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.up should collect every result into ArrayExtensions', () => {
    it('when the callbacks return different strings', () => {
        const utils = StringExtensions.of('abc');

        const result = utils.up([(s) => s.repeat(2), (s) => s.length.toString()]);

        expect(result.get()).toEqual(['abcabc', '3']);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
