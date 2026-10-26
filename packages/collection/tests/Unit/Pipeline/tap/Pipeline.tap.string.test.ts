import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('Pipeline.tap should call the logger and keep the wrapper type', () => {
    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => null);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the value is a string', () => {
        const utils = StringExtensions.of('Hello World');
        const logger = vi.fn((value) => console.log(value));

        const result = utils.tap(logger).capitalize().tap(logger);

        expect(result).toBeInstanceOf(StringExtensions);
        expect(logger).toHaveBeenCalledTimes(2);
    });
});
