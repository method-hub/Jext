import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NumberExtensions from '@Collection/Number/NumberExtensions';

describe('Pipeline.tap should call the logger and keep the wrapper type', () => {
    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => null);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the value is a number', () => {
        const utils = NumberExtensions.of(10);
        const logger = vi.fn((value) => console.log(value));

        const result = utils
            .tap(logger)
            .transform((n) => n * 2)
            .tap(logger);

        expect(result).toBeInstanceOf(NumberExtensions);
        expect(logger).toHaveBeenCalledTimes(2);
    });
});
