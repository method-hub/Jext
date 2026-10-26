import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.up should collect results of any type', () => {
    it('when the callbacks return a number and a string', () => {
        const sut = StringExtensions.of('abc');

        const result = sut.up<number | string>([(text) => text.length, (text) => text.toUpperCase()]);

        expect(result.get()).toEqual([3, 'ABC']);
    });
});
