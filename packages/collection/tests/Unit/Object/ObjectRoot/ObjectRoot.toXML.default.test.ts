import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectRoot.toXML should write one element per key', () => {
    it('when no root name is given', () => {
        const sut = ObjectExtensions.of<{ name: string; tags: string[] }>({ name: 'Dan', tags: ['a', 'b'] });

        const result = sut.toXML();

        expect(result).toEqual('<object><name>Dan</name><tags><item>a</item><item>b</item></tags></object>');
    });
});
