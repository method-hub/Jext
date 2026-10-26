import type { Transport } from '@Http/Contract/Transport';
import type { ProgressListener } from '@Http/Contract/Progress';
import Meter from '@Http/Transport/Meter';

/**
 * @summary Sends a request with `fetch`; with a download listener it counts the response body while it is read.
 *
 * @description The default transport. The response keeps its status, status text and headers; when the body is
 * counted it is wrapped into a new `Response`, which has no `url` and `redirected`. A response without a body
 * reports `{ loaded: 0, total: 0, percent: 100 }` once.
 */
export default class FetchTransport implements Transport {
    private readonly download: ProgressListener | null;

    constructor(download: ProgressListener | null = null) {
        this.download = download;
    }

    /**
     * @summary Calls `fetch` and resolves with its response.
     *
     * @param url - The resource URL or a `Request`.
     * @param init - The settings of the request.
     * @returns The response; its body is counted when there is a download listener.
     */
    public async send(url: string | Request, init: RequestInit): Promise<Response> {
        const response = await fetch(url, init);

        if (!this.download) {
            return response;
        }

        if (!response.body) {
            this.download(Meter.of(0, 0));
            return response;
        }

        const { status, statusText, headers } = response;
        const body = Meter.count(response.body, Meter.total(headers), this.download);

        return new Response(body, { status, statusText, headers });
    }
}
