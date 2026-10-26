import { API } from '../api';

interface FileInfo {
    type: string;
    size: number;
}

export default async function run(): Promise<FileInfo> {
    const response = await fetch(`${API}/logo.png`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const file = await response.blob();

    return { type: file.type, size: file.size };
}
