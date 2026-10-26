import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectRoot.toXML should throw TypeError', () => {
    it('when a key is not a valid XML name', () => {
        const sut = ObjectExtensions.of<Record<string, number>>({ 'first name': 1 });

        const run = (): string => sut.toXML();

        expect(run).toThrow(TypeError);
    });
});
