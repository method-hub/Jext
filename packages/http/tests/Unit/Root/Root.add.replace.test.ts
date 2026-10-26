import { describe, expect, it } from 'vitest';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import Hub from '@Http/Root/Hub';

describe('Root.add should keep one parser per class', () => {
    it('when a second instance of the same parser class is added', () => {
        const first = new JsonParser<unknown>();
        const second = new JsonParser<unknown>();

        const root: Hub<unknown> = new Root<unknown>().add(first).add(second);

        expect([...root.parsers.values()]).toEqual([second]);
    });
});
