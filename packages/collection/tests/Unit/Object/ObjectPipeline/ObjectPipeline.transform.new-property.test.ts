import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.transform should return a new ObjectExtensions with the result', () => {
    it('when the callback adds a property', () => {
        const utils = ObjectExtensions.of({ name: 'Dan' });

        const result = utils.transform((obj) => ({ ...obj, age: 34 }));

        expect(result.get()).toEqual({ name: 'Dan', age: 34 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
