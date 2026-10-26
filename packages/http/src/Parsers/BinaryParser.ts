import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for binary/octet-stream content types.
 */
export default class BinaryParser implements Decoder<ArrayBuffer> {
    /**
     * @summary Accepts `application/octet-stream` and `application/binary`.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return contentType === 'application/octet-stream' || contentType.startsWith('application/binary');
    }

    /**
     * @summary Reads the body as raw bytes.
     *
     * @param response - The accepted response.
     * @returns The body as an `ArrayBuffer`.
     */
    public async wrap(response: Response): Promise<ArrayBuffer> {
        return response.arrayBuffer();
    }
}
