import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.transform should return a new StringExtensions with the result', () => {
    it('when the callback trims the string', () => {
        const utils = StringExtensions.of('  hello  ');

        const result = utils.transform((s) => s.trim());

        expect(result.get()).toBe('hello');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
