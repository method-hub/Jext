import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

/**
 * @summary Decoder for multipart/form-data content types.
 */
export default class FormDataParser implements Decoder<FormData> {
    /**
     * @summary Accepts `multipart/form-data`.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return contentType.startsWith('multipart/form-data');
    }

    /**
     * @summary Reads the body as a form.
     *
     * @param response - The accepted response.
     * @returns The body as `FormData`.
     */
    public async wrap(response: Response): Promise<FormData> {
        return response.formData();
    }
}
