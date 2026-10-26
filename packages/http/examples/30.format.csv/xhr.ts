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

export default function run(): Promise<string[][]> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/report.csv`);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(parseCsv(xhr.responseText));
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
