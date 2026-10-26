import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('Pipeline.tap should call the logger and keep the wrapper type', () => {
    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => null);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the value is an object', () => {
        const utils = ObjectExtensions.of({ name: 'Dan' });
        const logger = vi.fn((value) => console.log(value));

        const result = utils
            .tap(logger)
            .transform((obj) => ({ ...obj, age: 34 }))
            .tap(logger);

        expect(result).toBeInstanceOf(ObjectExtensions);
        expect(logger).toHaveBeenCalledTimes(2);
    });
});
