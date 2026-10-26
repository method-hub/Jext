import { describe, expect, it, vi } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.when should pass the raw value to the condition', () => {
    it('when the condition is a predicate', () => {
        const utils = ArrayExtensions.of<number>([1, 2]);
        const condition = vi.fn((array: number[]) => array.length > 0);

        utils.when(condition, (self) => self);

        expect(condition).toHaveBeenCalledWith([1, 2]);
    });
});
