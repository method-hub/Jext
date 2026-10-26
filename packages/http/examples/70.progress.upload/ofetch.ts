// ofetch is built on fetch and has no progress option; fetch cannot report an upload.
// For an upload with progress use XMLHttpRequest: the XMLHttpRequest tab, jext or axios.
export default function run(): Promise<null> {
    return Promise.resolve(null);
}
