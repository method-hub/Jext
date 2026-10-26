import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectPipeline.chain should return the ObjectExtensions built in the callback', () => {
    it('when the callback wraps a new object', () => {
        const utils = ObjectExtensions.of({ name: 'dan' });

        const result = utils.chain((ext) => ObjectExtensions.of({ ...ext.get(), name: ext.get().name.toUpperCase() }));

        expect(result.get()).toEqual({ name: 'DAN' });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
