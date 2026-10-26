import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.transform should return a new StringExtensions with the result', () => {
    it('when the callback upper-cases the string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.transform((s) => s.toUpperCase());

        expect(result.get()).toBe('HELLO WORLD');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
