import type { Failure } from '@Http/Contract/Failure';
import type { StandardIssue } from '@Http/Contract/StandardSchema';
import HttpError from '@Http/Error/HttpError';

/**
 * @summary The error of a response whose data did not pass the schema given to `.schema()`.
 *
 * @description `issues` lists every problem the schema found, `value` holds the decoded data that failed.
 * The message names the first issue with its path, for example `name: Expected string (and 1 more)`.
 *
 * @template E - The type of the decoded error body; always `null` here, kept for `Result` compatibility.
 *
 * @example
 * const { error } = await http.get('/api/users/1').schema(User);
 * if (error instanceof ValidationError) {
 *     console.log(error.issues); // [{ message: 'Expected string', path: ['name'] }]
 * }
 */
export default class ValidationError<E = unknown> extends HttpError<E> {
    /** Every problem the schema found, with its path. */
    public readonly issues: ReadonlyArray<StandardIssue>;
    /** The decoded data that did not pass the schema. */
    public readonly value: unknown;

    constructor(issues: ReadonlyArray<StandardIssue>, value: unknown, failure: Failure<E>) {
        super(ValidationError.describe(issues), failure);
        this.name = 'ValidationError';
        this.issues = issues;
        this.value = value;
    }

    /**
     * @summary Builds the message from the first issue: its path, its message and how many issues follow.
     *
     * @param issues - The issues found by the schema.
     * @returns The message, e.g. `name: Expected string (and 1 more)`.
     */
    private static describe(issues: ReadonlyArray<StandardIssue>): string {
        const [first] = issues;

        if (!first) {
            return 'The response did not match the schema';
        }

        const path = (first.path ?? []).map((segment) => String(typeof segment === 'object' ? segment.key : segment));
        const where = path.length > 0 ? `${path.join('.')}: ` : '';
        const more = issues.length > 1 ? ` (and ${issues.length - 1} more)` : '';

        return `${where}${first.message}${more}`;
    }
}
