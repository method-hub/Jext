import type HttpError from '@Http/Error/HttpError';

/**
 * @summary The outcome of a request: either the decoded data or the error, never both.
 *
 * @description Check `error` first; after that TypeScript knows that `data` is `T`.
 *
 * @template T - The type of the decoded body of a successful (2xx) response.
 * @template E - The type of the decoded body of an error response, available as `error.data`.
 */
export type Result<T, E = unknown> =
    | {
          /** The decoded body of the 2xx response. */
          data: T;
          /** Always `null` when there is data. */
          error: null;
      }
    | {
          /** Always `null` when there is an error. */
          data: null;
          /** What went wrong: an error status, no response, an undecodable body or a failed schema. */
          error: HttpError<E>;
      };
