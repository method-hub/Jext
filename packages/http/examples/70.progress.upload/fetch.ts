// fetch reports no upload progress. Streaming a request body works only in Chromium over HTTP/2, so the
// progress of an upload comes from XMLHttpRequest: the XMLHttpRequest tab, or jext and axios built on it.
export default function run(): Promise<null> {
    return Promise.resolve(null);
}
