import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.cond should run the step of the first matching case', () => {
    it('when the first condition matches for a string', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.cond([
            [(text) => text.length > 0, (self) => self.capitalize()],
            [(text) => text.length > 0, (self) => self.transform((text) => text.toUpperCase())],
        ]);

        expect(result.get()).toEqual('Hello world');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
