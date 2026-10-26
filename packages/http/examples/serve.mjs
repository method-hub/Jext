// Starts the lesson server: npm run examples:serve -w @metapraxis/jext-http
import { fileURLToPath } from 'node:url';
import { createLessonServer } from './server.ts';

const port = Number(process.env.PORT ?? 4000);
const fixtures = fileURLToPath(new URL('./__fixtures__', import.meta.url));

createLessonServer(fixtures).listen(port, () => {
    console.log(`Lesson server on http://localhost:${port}`);
});
