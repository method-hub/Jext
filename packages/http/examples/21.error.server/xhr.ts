import { API } from '../api';

interface Failure {
    status: number;
    body: string;
}

export default function run(): Promise<Failure> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/reports/daily`);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                reject(new Error('The report service should be down'));
            } else {
                resolve({ status: xhr.status, body: xhr.responseText });
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
