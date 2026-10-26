import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.transform should return a new ObjectExtensions with the result', () => {
    it('when the callback changes a property', () => {
        const utils = ObjectExtensions.of({ name: 'Dan', age: 25 });

        const result = utils.transform((obj) => ({ name: obj.name.toUpperCase() }));

        expect(result.get()).toEqual({ name: 'DAN' });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
