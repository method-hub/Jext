/**
 * @summary How much of a body has been sent or received.
 *
 * @description `total` and `percent` are known only when the size is known: from `Content-Length` for a download,
 * from the body for an upload. Without them `loaded` still grows, so a UI can show the bytes or a spinner.
 */
export interface Progress {
    /** Bytes sent or received so far. */
    loaded: number;
    /** The size of the whole body in bytes, when it is known. */
    total?: number;
    /** `loaded` as a whole percent of `total`, from 0 to 100, when `total` is known. */
    percent?: number;
}

/**
 * @summary A callback that receives the progress of an upload or a download.
 */
export type ProgressListener = (progress: Progress) => void;

/**
 * @summary The progress callbacks of one request.
 */
export interface ProgressOptions {
    /** Called while the body of the request is sent; the request then goes through `XMLHttpRequest`. */
    onUploadProgress?: ProgressListener;
    /** Called while the body of the response is received. */
    onDownloadProgress?: ProgressListener;
}
