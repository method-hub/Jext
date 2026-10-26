import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface FileInfo {
    type: string;
    size: number;
}

export default async function run(): Promise<FileInfo> {
    const { data, error } = await http.get<Blob>(`${API}/export`);

    if (error) {
        throw error;
    }

    return { type: data.type, size: data.size };
}
