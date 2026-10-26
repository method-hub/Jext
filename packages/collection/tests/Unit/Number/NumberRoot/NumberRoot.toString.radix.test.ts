import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toString should write the number in the given base', () => {
    it('when the radix is 16', () => {
        const sut = NumberExtensions.of(255);

        const result = sut.toString(16);

        expect(result).toEqual('ff');
    });
});
