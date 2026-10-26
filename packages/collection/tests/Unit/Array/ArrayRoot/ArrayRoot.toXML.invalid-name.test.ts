import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';

describe('ArrayRoot.toXML should throw TypeError', () => {
    it('when the root name is not a valid XML name', () => {
        const sut = ArrayExtensions.of<number>([1]);

        const run = (): string => sut.toXML('1 items');

        expect(run).toThrow(TypeError);
    });
});
