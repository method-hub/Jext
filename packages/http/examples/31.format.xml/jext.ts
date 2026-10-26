import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Catalog {
    catalog: { book: { title: string; year: number }[] };
}

export default async function run(): Promise<string[]> {
    const { data, error } = await http.get<Catalog>(`${API}/books.xml`);

    if (error) {
        throw error;
    }

    return data.catalog.book.map((book) => book.title);
}
