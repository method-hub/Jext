import { describe, expect, it } from 'vitest';
import ArrayExtensions from '@Collection/Array/ArrayExtensions';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.up should collect every result into ArrayExtensions', () => {
    it('when the callbacks return different types', () => {
        const utils = ObjectExtensions.of({ x: 10, y: 20 });

        const result = utils.up([(obj) => obj.x + obj.y, (obj) => obj.x * obj.y]);

        expect(result.get()).toEqual([30, 200]);
        expect(result).toBeInstanceOf(ArrayExtensions);
    });
});
