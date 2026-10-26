import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.chain should return the StringExtensions built in the callback', () => {
    it('when the callback uses StringExtensions methods', () => {
        const utils = StringExtensions.of('hello world');

        const result = utils.chain((ext) => ext.capitalize());

        expect(result).toBeInstanceOf(StringExtensions);
    });
});
