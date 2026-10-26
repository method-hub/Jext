import { describe, expect, it } from 'vitest';
import type { http } from '@metapraxis/jext-http';
import type collection from '@metapraxis/jext-collection';
// The built file, as unpkg serves it: run npm run packages:build first (tests:browser does)
import source from '../../../packages/jext/dist/index.umd.js?raw';

describe('Jext.umd should give the global Jext with both packages from one script tag', () => {
    it('when only packages/jext/dist/index.umd.js is loaded and an XML answer is fetched', async () => {
        const script = document.createElement('script');
        script.textContent = source;
        document.head.append(script);
        const { Jext: jext } = globalThis as unknown as { Jext: { http: typeof http; collection: typeof collection } };

        const { data } = await jext.http.get('/__test/echo?type=application/xml&body=<a><b>1</b></a>');

        expect(data).toEqual({ a: { b: 1 } });
        expect(jext.collection([3, 1]).value).toEqual([3, 1]);
    });
});
