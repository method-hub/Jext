// @ts-check
import { Converter } from 'typedoc';

/**
 * @summary TypeDoc plugin: turns the `@summary` block of every comment into the comment's lead paragraph.
 *
 * @description Jext writes the one-line description of a member as `@summary`, which TypeDoc does not render by
 * default. Moving it into the summary makes it the first paragraph of each page and the text of index tables.
 *
 * @param {import('typedoc').Application} app - The TypeDoc application.
 */
export function load(app) {
    app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
        for (const reflection of Object.values(context.project.reflections)) {
            const comments = [reflection.comment];

            if ('signatures' in reflection && Array.isArray(reflection.signatures)) {
                comments.push(...reflection.signatures.map((signature) => signature.comment));
            }

            for (const comment of comments) {
                const tag = comment?.getTag('@summary');

                if (comment && tag) {
                    comment.summary = [...tag.content, ...(comment.summary.length ? [{ kind: 'text', text: '\n\n' }] : []), ...comment.summary];
                    comment.removeTags('@summary');
                }
            }
        }
    });
}
