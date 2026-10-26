import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toString should write the number in base 10', () => {
    it('when no radix is given', () => {
        const sut = NumberExtensions.of(255);

        const result = sut.toString();

        expect(result).toEqual('255');
    });
});
