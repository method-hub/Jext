import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetPipeline.up should give every callback its own copy', () => {
    it('when a callback changes its set', () => {
        const sut = SetExtensions.of<number>(new Set([1]));

        const result = sut.up<number>([(set) => set.add(9).size, (set) => set.size]);

        expect(result.get()).toEqual([2, 1]);
    });
});
