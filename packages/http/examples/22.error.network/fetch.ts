import { API } from '../api';

export default async function run(): Promise<number> {
    try {
        const response = await fetch(`${API}/drop`);
        return response.status;
    } catch {
        return 0;
    }
}
