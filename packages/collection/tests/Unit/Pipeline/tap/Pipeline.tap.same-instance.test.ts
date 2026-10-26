import { describe, expect, it, vi } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.tap should return the same wrapper', () => {
    it('when the logger changes the value it receives', () => {
        const utils = ArrayExtensions.of([1, 2, 3]);
        const logger = vi.fn((array: number[]) => array.map((x) => x * 100));

        const result = utils.tap(logger);

        expect(result).toBe(utils);
        expect(result.get()).toEqual([1, 2, 3]);
    });
});
