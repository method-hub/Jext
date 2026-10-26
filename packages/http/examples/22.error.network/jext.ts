import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<number> {
    const { error } = await http.get(`${API}/drop`);

    if (!error) {
        throw new Error('The connection should break');
    }

    return error.status;
}
