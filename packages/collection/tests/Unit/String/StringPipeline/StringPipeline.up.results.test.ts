import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.up should collect every result into ArrayExtensions', () => {
    it('when several callbacks are given', () => {
        const utils = StringExtensions.of('hello');

        const result = utils.up([(s) => s.toUpperCase(), (s) => `${s}!`, (s) => s.split('').reverse().join('')]);

        expect(result.get()).toEqual(['HELLO', 'hello!', 'olleh']);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
