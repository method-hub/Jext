import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.chain should return the StringExtensions built in the callback', () => {
    it('when the callback wraps a new string', () => {
        const utils = StringExtensions.of('hello');

        const result = utils.chain((ext) => StringExtensions.of(ext.get().toUpperCase()));

        expect(result.get()).toBe('HELLO');
        expect(result).toBeInstanceOf(StringExtensions);
    });
});
