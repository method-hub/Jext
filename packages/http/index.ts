import Bootstrap from '@Http/Bootstrap';

export { default as HttpError } from '@Http/Error/HttpError';
export { default as ValidationError } from '@Http/Error/ValidationError';
export type { Result } from '@Http/Contract/Result';
export type { HttpRequest, BodyRequest } from '@Http/Contract/HttpRequest';
export type { RequestOptions, BodyRequestOptions } from '@Http/Contract/RequestOptions';
export type { SendOptions } from '@Http/Contract/SendOptions';
export type { Query, QueryValue } from '@Http/Contract/Query';
export type { Payload } from '@Http/Contract/Payload';
export type { Failure } from '@Http/Contract/Failure';
export type { Sender } from '@Http/Contract/Sender';
export type { Streamer, StreamSettings } from '@Http/Contract/Streamer';
export type { ServerEvent } from '@Http/Contract/ServerEvent';
export type { Format, Formats } from '@Http/Contract/Format';
export type {
    StandardSchema,
    StandardProps,
    StandardResult,
    StandardTypes,
    StandardIssue,
    InferOutput,
} from '@Http/Contract/StandardSchema';
export type { ClientOptions } from '@Http/Contract/ClientOptions';
export type { Retry, RetryOptions } from '@Http/Contract/RetryOptions';
export type { Progress, ProgressListener } from '@Http/Contract/Progress';
export type { StreamRequest } from '@Http/Contract/StreamRequest';
export type { StreamOptions } from '@Http/Contract/StreamOptions';
export type { Reconnect, ReconnectOptions } from '@Http/Contract/Reconnect';
export type { Hooks, Outgoing, BeforeRequest, AfterResponse } from '@Http/Contract/Hooks';
export type { default as Http } from '@Http/Http';

/**
 * @summary Pre-configured fluent HTTP client with automatic content-type detection.
 *
 * @description `http.get/post/put/patch/delete/head()` prepare a request that is sent when awaited, `http.sse()`
 * reads Server-Sent Events, `http.extend()` makes a client with shared settings. Nothing is thrown: every request
 * resolves with `{ data, error }`.
 *
 * @example
 * import { http } from '@metapraxis/jext-http';
 *
 * const { data: user, error } = await http.get<User>('/api/users/1');
 */
export const http = new Bootstrap().init();
