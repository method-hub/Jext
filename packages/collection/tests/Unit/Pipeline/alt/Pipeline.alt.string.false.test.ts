import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.alt should execute the right branch', () => {
    it('when the condition is false for a string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.alt(
            (text) => text.length > 100,
            (self) => self.capitalize(),
            (self) => self.transform((text) => text.toUpperCase())
        );

        expect(result.get()).toEqual('HELLO WORLD');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
