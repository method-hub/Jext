import { describe, expect, it } from 'vitest';
import QueryString from '@Http/Request/QueryString';

describe('QueryString.append should keep the fragment at the end', () => {
    it('when the URL has a #fragment', () => {
        const url = '/page#top';

        const result = QueryString.append(url, { x: 1 });

        expect(result).toBe('/page?x=1#top');
    });
});
