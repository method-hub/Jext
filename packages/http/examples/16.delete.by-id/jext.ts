import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    const { error } = await http.delete<null>(`${API}/users/4`);

    if (error) {
        throw error;
    }

    return true;
}
