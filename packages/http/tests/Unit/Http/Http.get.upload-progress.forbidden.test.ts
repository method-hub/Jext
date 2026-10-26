import { describe, expect, it } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.get should not offer onUploadProgress', () => {
    it('when a request without a body is built', () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const request = http.get<string>('/files/1');

        // @ts-expect-error: only post, put and patch have a body to upload
        expect(typeof request.onUploadProgress).toBe('function');
        expect(typeof request.onDownloadProgress).toBe('function');
    });
});
