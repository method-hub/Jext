import { describe, expect, it } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import type { StreamRequest } from '@Http/Contract/StreamRequest';

describe('Http.sse should give a stream without the methods of a request', () => {
    it('when a stream is built', () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const events: StreamRequest<{ n: number }> = http.sse('/events').json<{ n: number }>();

        // @ts-expect-error: a stream has no .as()
        expect(typeof events.as).toBe('undefined');
        // @ts-expect-error: a stream has no .schema()
        expect(typeof events.schema).toBe('undefined');
        // @ts-expect-error: a stream has no .retry(), it has .reconnect()
        expect(typeof events.retry).toBe('undefined');
        // @ts-expect-error: a stream has no .timeout()
        expect(typeof events.timeout).toBe('undefined');
        // @ts-expect-error: a stream has no progress
        expect(typeof events.onDownloadProgress).toBe('undefined');
        expect(typeof events.reconnect).toBe('function');
    });
});
