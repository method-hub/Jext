/**
 * @summary A schema from any library that implements Standard Schema v1 (Zod, Valibot, ArkType and others).
 *
 * @description Copied from the specification (https://standardschema.dev), as its authors suggest, so that no
 * dependency is needed: the library only reads the `~standard` property of the schema the caller passes.
 *
 * @template Input - What the schema accepts.
 * @template Output - What the schema returns after validation.
 */
export interface StandardSchema<Input = unknown, Output = Input> {
    /** The properties every Standard Schema library puts on its schemas. */
    readonly '~standard': StandardProps<Input, Output>;
}

/**
 * @summary The `~standard` property of a schema.
 */
export interface StandardProps<Input = unknown, Output = Input> {
    /** The version of the specification, always `1`. */
    readonly version: 1;
    /** The name of the library that made the schema: `'zod'`, `'valibot'`… */
    readonly vendor: string;
    /** Checks a value and returns it validated or the list of issues. */
    readonly validate: (value: unknown) => StandardResult<Output> | Promise<StandardResult<Output>>;
    /** The input and output types, for TypeScript only; never present at runtime. */
    readonly types?: StandardTypes<Input, Output> | undefined;
}

/**
 * @summary The outcome of `validate()`: the validated value or the list of issues.
 */
export type StandardResult<Output> =
    | {
          /** The validated value. */
          readonly value: Output;
          /** Absent when the value is valid. */
          readonly issues?: undefined;
      }
    | {
          /** Every problem the schema found. */
          readonly issues: ReadonlyArray<StandardIssue>;
      };

/**
 * @summary One problem found by the schema: what is wrong and where.
 */
export interface StandardIssue {
    /** What is wrong, in the words of the schema library. */
    readonly message: string;
    /** Where it is wrong: the keys from the root of the data to the bad value. */
    readonly path?:
        | ReadonlyArray<
              | PropertyKey
              | {
                    /** One key of the path, as some libraries wrap it. */
                    readonly key: PropertyKey;
                }
          >
        | undefined;
}

/**
 * @summary Type-only carrier of the input and output types of a schema.
 */
export interface StandardTypes<Input = unknown, Output = Input> {
    /** What the schema accepts. */
    readonly input: Input;
    /** What the schema returns after validation. */
    readonly output: Output;
}

/**
 * @summary The type a schema returns after validation: `InferOutput<typeof User>`.
 */
export type InferOutput<S extends StandardSchema> = NonNullable<S['~standard']['types']>['output'];
