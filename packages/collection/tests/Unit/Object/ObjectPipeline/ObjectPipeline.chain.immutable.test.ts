import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.chain should keep the original object', () => {
    it('when the callback changes the object', () => {
        const original = { name: 'Dan' };
        const utils = ObjectExtensions.of(original);

        utils.chain((ext) => ObjectExtensions.of({ ...ext.get(), hacked: true }));

        expect(original).toEqual({ name: 'Dan' });
    });
});
