import { describe, expect, it } from 'vitest';
import * as jext from '../../../packages/jext/index';

describe('Jext.exports should not expose internal classes', () => {
    it('when the runtime exports are listed', () => {
        const module: object = jext;

        const names = Object.keys(module).sort();

        expect(names).toEqual(['HttpError', 'ValidationError', 'collection', 'http']);
    });
});
