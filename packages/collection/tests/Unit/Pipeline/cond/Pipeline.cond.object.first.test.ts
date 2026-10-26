import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('Pipeline.cond should run the step of the first matching case', () => {
    it('when the first condition matches for an object', () => {
        const utils = ObjectExtensions.of<{ name: string; age?: number }>({ name: 'Dan' });

        const result = utils.cond([
            [
                (object) => object.name === 'Dan',
                (self) => self.transform<{ name: string; age?: number }>((object) => ({ ...object, age: 34 })),
            ],
            [
                (object) => object.name === 'Dan',
                (self) => self.transform<{ name: string; age?: number }>((object) => ({ ...object, age: 0 })),
            ],
        ]);

        expect(result.get()).toEqual({ name: 'Dan', age: 34 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
