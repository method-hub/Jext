import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.transform should keep the original string', () => {
    it('when the callback changes the string', () => {
        const utils = StringExtensions.of('hello');

        utils.transform((s) => s.toUpperCase());

        expect(utils.get()).toBe('hello');
    });
});
