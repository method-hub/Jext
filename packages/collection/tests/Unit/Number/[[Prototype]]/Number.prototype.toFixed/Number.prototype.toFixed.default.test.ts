import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberExtensions.toFixed should round to an integer', () => {
    it('when no digits are given', () => {
        const sut = NumberExtensions.of(2.5);

        const result = sut.toFixed();

        expect(result.get()).toEqual('3');
    });
});
