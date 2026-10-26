import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toJson should write null', () => {
    it('when the number is NaN', () => {
        const sut = NumberExtensions.of(Number.NaN);

        const result = sut.toJson();

        expect(result).toEqual('null');
    });
});
