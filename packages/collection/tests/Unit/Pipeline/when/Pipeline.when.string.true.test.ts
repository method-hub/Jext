import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.when should execute the callback', () => {
    it('when the condition is true for a string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.when(
            (text) => text.length > 0,
            (self) => self.capitalize()
        );

        expect(result.get()).toEqual('Hello world');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
