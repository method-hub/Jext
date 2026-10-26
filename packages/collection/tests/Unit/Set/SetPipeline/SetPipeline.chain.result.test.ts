import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetPipeline.chain should return what the callback returns', () => {
    it('when the callback filters the set', () => {
        const sut = SetExtensions.of<number>(new Set([1, 2, 3]));

        const result = sut.chain((self) => self.filter((value) => value > 1));

        expect([...result.get()]).toEqual([2, 3]);
    });
});
