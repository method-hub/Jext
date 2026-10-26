import type { Payload } from '@Http/Contract/Payload';

/**
 * @summary Turns a `.body()` value into what `fetch` sends.
 */
export default class Encoder {
    /**
     * @summary Returns the body for `fetch` and the Content-Type it needs, `null` when `fetch` sets it itself.
     *
     * @description Native bodies go as they are, so `fetch` sets the type (the multipart boundary included);
     * everything else becomes JSON with `application/json`.
     *
     * @param payload - The value given to `.body()`.
     * @returns The body and its Content-Type.
     */
    public static encode(payload: Payload): { body: BodyInit | null; contentType: string | null } {
        if (payload === null || typeof payload === 'undefined') {
            return { body: null, contentType: null };
        }

        if (Encoder.native(payload)) {
            return { body: payload, contentType: null };
        }

        return { body: JSON.stringify(payload), contentType: 'application/json' };
    }

    /**
     * @summary Answers whether `fetch` sends the value as it is.
     *
     * @param payload - The value given to `.body()`.
     * @returns `true` for strings, `FormData`, `URLSearchParams`, `Blob`, buffers, typed arrays and streams.
     */
    private static native(payload: Payload): payload is BodyInit {
        return (
            typeof payload === 'string' ||
            payload instanceof FormData ||
            payload instanceof URLSearchParams ||
            payload instanceof Blob ||
            payload instanceof ArrayBuffer ||
            ArrayBuffer.isView(payload) ||
            payload instanceof ReadableStream
        );
    }
}
