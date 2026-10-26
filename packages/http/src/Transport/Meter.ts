import type { Progress, ProgressListener } from '@Http/Contract/Progress';

/**
 * @summary Turns byte counts into `Progress` and counts the bytes of a response body while it is read.
 */
export default class Meter {
    /**
     * @summary Builds a `Progress`; `total` and `percent` are left out when the size is not known.
     *
     * @param loaded - The bytes sent or received so far.
     * @param total - The size of the whole body, `null` when it is not known.
     * @returns The progress.
     */
    public static of(loaded: number, total: number | null): Progress {
        if (total === null) {
            return { loaded };
        }

        const percent = total === 0 ? 100 : Math.min(100, Math.floor((loaded / total) * 100));

        return { loaded, total, percent };
    }

    /**
     * @summary The size of a response body from `Content-Length`, unless the body is compressed.
     *
     * @description With `Content-Encoding: gzip` the header counts compressed bytes, while the stream gives
     * decompressed ones, so the size is treated as unknown.
     *
     * @param headers - The headers of the response.
     * @returns The size in bytes, `null` when it is not known.
     */
    public static total(headers: Headers): number | null {
        const encoding = (headers.get('content-encoding') ?? 'identity').trim().toLowerCase();
        const length = Number(headers.get('content-length') ?? Number.NaN);

        return encoding === 'identity' && Number.isFinite(length) && length >= 0 ? length : null;
    }

    /**
     * @summary Returns a stream with the same bytes that calls `listener` after every chunk.
     *
     * @param body - The body of the response.
     * @param total - The size of the body, `null` when it is not known.
     * @param listener - Called after every chunk.
     * @returns The counted stream.
     */
    public static count(
        body: ReadableStream<Uint8Array>,
        total: number | null,
        listener: ProgressListener
    ): ReadableStream<Uint8Array> {
        const reader = body.getReader();
        let loaded = 0;

        return new ReadableStream<Uint8Array>({
            async pull(controller): Promise<void> {
                const { done, value } = await reader.read();

                if (done) {
                    controller.close();
                    return;
                }

                loaded += value.byteLength;
                listener(Meter.of(loaded, total));
                controller.enqueue(value);
            },
            cancel(reason: unknown): Promise<void> {
                return reader.cancel(reason);
            },
        });
    }
}
