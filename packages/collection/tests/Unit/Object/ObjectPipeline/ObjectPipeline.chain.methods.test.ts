import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.chain should return the ObjectExtensions built in the callback', () => {
    it('when the callback uses ObjectExtensions methods', () => {
        const utils = ObjectExtensions.of({ count: 0 });

        const result = utils.chain((ext) => ObjectExtensions.of({ count: ext.get().count + 1 }));

        expect(result.get()).toEqual({ count: 1 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
