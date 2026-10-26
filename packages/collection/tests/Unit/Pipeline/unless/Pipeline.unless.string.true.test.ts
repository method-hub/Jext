import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.unless should return the original wrapper', () => {
    it('when the condition is true for a string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.unless(
            (text) => text.length > 0,
            (self) => self.capitalize()
        );

        expect(result.get()).toEqual('hello world');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
