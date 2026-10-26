import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.alt should execute the left branch', () => {
    it('when the condition is true for a string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.alt(
            (text) => text.length > 0,
            (self) => self.capitalize(),
            (self) => self.transform((text) => text.toUpperCase())
        );

        expect(result.get()).toEqual('Hello world');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
