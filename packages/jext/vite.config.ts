import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const packages = resolve(__dirname, '..');

/**
 * `vite build` writes the ES module, CommonJS and types of the aggregator: it re-exports the packages, which npm
 * installs as its dependencies, so they stay external instead of being bundled twice. `vite build --mode umd`
 * writes the UMD file for a `<script>` tag (unpkg, jsdelivr): a browser installs nothing, so the packages and
 * their dependencies are bundled from source into this one file, the global `Jext`.
 */
export default defineConfig(({ mode }) => {
  const umd = mode === 'umd';

  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'index.ts'),
        name: 'Jext',
        formats: umd ? ['umd'] : ['es', 'cjs'],
        fileName: (format) => ({ es: 'index.mjs', cjs: 'index.cjs' })[format] ?? `index.${format}.js`,
      },
      // The UMD build runs after the main one and must keep its files
      emptyOutDir: !umd,
      // The UMD file carries the whole library, so it is minified like the packages' own builds
      ...(umd && { minify: 'terser', terserOptions: { mangle: { keep_classnames: true, keep_fnames: true } } }),
      rollupOptions: {
        external: umd ? [] : ['@metapraxis/jext-http', '@metapraxis/jext-collection'],
      },
    },
    plugins: umd
      ? []
      : [
          dts({
            tsconfigPath: resolve(__dirname, 'tsconfig.json'),
            entryRoot: __dirname,
            outDir: 'dist/types',
          }),
        ],
    resolve: {
      alias: umd
        ? {
            '@metapraxis/jext-http': resolve(packages, 'http/index.ts'),
            '@metapraxis/jext-collection': resolve(packages, 'collection/index.ts'),
            '@Http': resolve(packages, 'http/src'),
            '@Collection': resolve(packages, 'collection/src'),
          }
        : {},
    },
  };
});
