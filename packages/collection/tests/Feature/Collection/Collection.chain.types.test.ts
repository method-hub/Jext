import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';

describe('collection should carry a chain across wrapper types', () => {
    it('when an array becomes an object, a map and an array again', () => {
        const value = ['a', 'b'];

        const result = collection<string>(value)
            .toObject()
            .toMap()
            .toArray()
            .map(([key, item]) => `${key}=${item}`);

        expect(result.get()).toEqual(['0=a', '1=b']);
    });
});
