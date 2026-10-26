import { describe, expect, it } from 'vitest';
import EmptyParser from '@Http/Parsers/EmptyParser';

describe('EmptyParser.wrap should return null', () => {
    it('when called', async () => {
        const parser = new EmptyParser();

        const data = await parser.wrap();

        expect(data).toBeNull();
    });
});
