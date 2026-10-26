import { describe, expect, it } from 'vitest';
import SetExtensions from '@Collection/Set/SetExtensions';

describe('SetRoot.toXML should throw TypeError', () => {
    it('when the item name is not a valid XML name', () => {
        const sut = SetExtensions.of<string>(new Set(['a']));

        const run = (): string => sut.toXML('items', '<item>');

        expect(run).toThrow(TypeError);
    });
});
