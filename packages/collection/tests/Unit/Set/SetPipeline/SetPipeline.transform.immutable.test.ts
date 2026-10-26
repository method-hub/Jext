import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetPipeline.transform should keep the original set', () => {
    it('when the callback changes its copy', () => {
        const original = new Set([1]);
        const sut = SetExtensions.of<number>(original);

        sut.transform((set) => set.add(2));

        expect([...original]).toEqual([1]);
    });
});
