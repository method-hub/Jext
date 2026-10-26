import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('NumberRoot.toJson should serialize the number', () => {
    it('when the number is finite', () => {
        const sut = NumberExtensions.of(1.5);

        const result = sut.toJson();

        expect(result).toEqual('1.5');
    });
});
