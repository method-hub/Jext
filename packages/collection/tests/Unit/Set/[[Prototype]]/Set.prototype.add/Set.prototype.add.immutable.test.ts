import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetExtensions.add should keep the original set', () => {
    it('when a value is added', () => {
        const original = new Set([1]);
        const sut = SetExtensions.of<number>(original);

        sut.add(2);

        expect([...original]).toEqual([1]);
    });
});
