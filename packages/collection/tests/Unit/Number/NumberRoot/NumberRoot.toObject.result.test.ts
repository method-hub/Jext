import { describe, expect, it } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('NumberRoot.toObject should put the number into an object wrapper', () => {
    it('when it is called', () => {
        const sut = NumberExtensions.of(7);

        const result = sut.toObject();

        expect(result.get()).toEqual({ value: 7 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
