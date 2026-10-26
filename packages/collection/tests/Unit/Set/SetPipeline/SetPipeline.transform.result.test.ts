import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetPipeline.transform should wrap the set the callback returns', () => {
    it('when the callback adds a value', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const result = sut.transform((set) => set.add(2));

        expect([...result.get()]).toEqual([1, 2]);
        expect(result).toBeInstanceOf(SetExtensions);
    });
});
