import { API } from '../api';

// A small CSV reader: quoted cells may hold commas and doubled quotes, but not line breaks
function parseCsv(text: string): string[][] {
    const cell = /(?:^|,)(?:"(?<quoted>(?:[^"]|"")*)"|(?<plain>[^,]*))/gu;

    return text
        .trim()
        .split('\n')
        .map((line) =>
            [...line.matchAll(cell)].map(({ groups }) => groups?.quoted?.replace(/""/gu, '"') ?? groups?.plain ?? '')
        );
}

export default async function run(): Promise<string[][]> {
    const response = await fetch(`${API}/report.csv`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return parseCsv(await response.text());
}
