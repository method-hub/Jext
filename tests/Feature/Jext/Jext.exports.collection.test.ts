import { describe, expect, it } from 'vitest';
import { collection } from '../../../packages/jext/index';

describe('Jext.exports should expose a working collection', () => {
    it('when the aggregator is imported', () => {
        const numbers: number[] = [1, 2, 3];

        const doubled = collection<number>(numbers).map((item: number) => item * 2);

        expect(doubled.get()).toEqual([2, 4, 6]);
    });
});
