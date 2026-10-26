import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringRoot.toJson should quote and escape the string', () => {
    it('when it holds quotes', () => {
        const sut = StringExtensions.of('say "hi"');

        const result = sut.toJson();

        expect(result).toEqual('"say \\"hi\\""');
    });
});
