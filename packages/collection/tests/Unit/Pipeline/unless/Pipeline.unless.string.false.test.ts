import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.unless should execute the callback', () => {
    it('when the condition is false for a string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.unless(
            (text) => text.length > 100,
            (self) => self.capitalize()
        );

        expect(result.get()).toEqual('Hello world');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
