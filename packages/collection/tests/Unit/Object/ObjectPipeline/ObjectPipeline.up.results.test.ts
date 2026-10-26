import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.up should collect every result into ArrayExtensions', () => {
    it('when several callbacks are given', () => {
        const utils = ObjectExtensions.of({ name: 'Dan', age: 25 });

        const result = utils.up([(obj) => obj.name, (obj) => String(obj.age)]);

        expect(result.get()).toEqual(['Dan', '25']);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
