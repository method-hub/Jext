import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('Pipeline.tap should call the logger and keep the wrapper type', () => {
    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => null);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the value is an array', () => {
        const utils = ArrayExtensions.of([1, 2, 3, 4, 5]);
        const logger = vi.fn((value) => console.log(value));

        const result = utils
            .tap(logger)
            .map((x) => x * 2)
            .tap(logger);

        expect(result).toBeInstanceOf(ArrayExtensions);
        expect(logger).toHaveBeenCalledTimes(2);
    });
});
