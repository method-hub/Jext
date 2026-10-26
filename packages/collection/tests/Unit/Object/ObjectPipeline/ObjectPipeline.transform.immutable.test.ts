import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.transform should keep the original object', () => {
    it('when the callback changes the object', () => {
        const original = { name: 'Dan' };
        const utils = ObjectExtensions.of(original);

        utils.transform((obj) => ({ ...obj, age: 34 }));

        expect(original).toEqual({ name: 'Dan' });
    });
});
