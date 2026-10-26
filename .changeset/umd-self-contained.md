---
'@metapraxis/jext-http': patch
'@metapraxis/jext': patch
---

`dist/index.umd.js` works on its own in a `<script>` tag: http bundles `fast-xml-parser`, and `@metapraxis/jext` bundles both packages, instead of failing on a missing global or `require`.
