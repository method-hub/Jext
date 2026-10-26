import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

const MEDIA_TYPES = ['image/', 'audio/', 'video/', 'font/', 'application/pdf'];

/**
 * @summary Decoder for media content types: images, audio, video, fonts and PDF.
 *
 * @description Returns the body as a `Blob`, ready for `URL.createObjectURL()`.
 * `image/svg+xml` never reaches it, because `XmlParser` runs earlier.
 */
export default class MediaParser implements Decoder<Blob> {
    /**
     * @summary Accepts images, audio, video, fonts and PDF.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return MEDIA_TYPES.some((type) => contentType.startsWith(type));
    }

    /**
     * @summary Reads the body as a file, ready for `URL.createObjectURL()`.
     *
     * @param response - The accepted response.
     * @returns The body as a `Blob`.
     */
    public wrap(response: Response): Promise<Blob> {
        return response.blob();
    }
}
