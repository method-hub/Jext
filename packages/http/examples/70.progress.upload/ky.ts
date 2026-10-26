// ky has onUploadProgress, but it streams the request body through fetch: it needs Chromium with HTTP/2 or
// HTTP/3 (over HTTP/1.1 the upload fails with a network error) and is silently ignored elsewhere.
// For an upload with progress in every browser use XMLHttpRequest: the XMLHttpRequest tab, jext or axios.
export default function run(): Promise<null> {
    return Promise.resolve(null);
}
