import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.when should return the original wrapper', () => {
    it('when the condition is false for a string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.when(
            (text) => text.length > 100,
            (self) => self.capitalize()
        );

        expect(result.get()).toEqual('hello world');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
