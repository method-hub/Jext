import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for binary attachment content types (Content-Disposition: attachment).
 */
export default class BlobParser implements Decoder<Blob> {
    /**
     * @summary Accepts any response with `Content-Disposition: attachment`, whatever its Content-Type.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ disposition }: Data): boolean {
        return disposition.includes('attachment');
    }

    /**
     * @summary Reads the body as a file.
     *
     * @param response - The accepted response.
     * @returns The body as a `Blob`.
     */
    public async wrap(response: Response): Promise<Blob> {
        return response.blob();
    }
}
