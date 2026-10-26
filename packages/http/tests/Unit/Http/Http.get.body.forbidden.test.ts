import { describe, expect, it } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

/**
 * The real check is the compiler: `npm run typecheck` fails on this file if an `@ts-expect-error` line compiles,
 * that is, if HttpRequest ever exposes body(). At runtime the shared request class still has the method.
 */
describe('HttpRequest should not offer body()', () => {
    it('when the request is GET, HEAD or DELETE', () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const requests = [http.get<string>('/a'), http.head<string>('/a'), http.delete<string>('/a')];

        // @ts-expect-error GET has no body()
        expect(typeof requests[0].body).toBe('function');
        // @ts-expect-error HEAD has no body()
        expect(typeof requests[1].body).toBe('function');
        // @ts-expect-error DELETE has no body()
        expect(typeof requests[2].body).toBe('function');
    });
});
