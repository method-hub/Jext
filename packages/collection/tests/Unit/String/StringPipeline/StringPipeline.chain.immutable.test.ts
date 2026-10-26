import { describe, expect, it } from 'vitest';
import StringExtensions from '@Collection/String/StringExtensions';

describe('StringPipeline.chain should keep the original string', () => {
    it('when the callback changes the string', () => {
        const utils = StringExtensions.of('hello');

        utils.chain((ext) => StringExtensions.of(ext.get().toUpperCase()));

        expect(utils.get()).toBe('hello');
    });
});
