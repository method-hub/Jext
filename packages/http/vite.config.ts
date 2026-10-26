import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

/**
 * `vite build` writes the ES module, CommonJS and types for bundlers and Node: the one runtime dependency
 * (ADR 0004) is installed with the package, not bundled into it. `vite build --mode umd` writes the UMD file for a
 * `<script>` tag (unpkg, jsdelivr): a browser has nothing to install, so everything goes inside.
 */
export default defineConfig(({ mode }) => {
  const umd = mode === 'umd';

  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'index.ts'),
        name: 'JextHttp',
        formats: umd ? ['umd'] : ['es', 'cjs'],
        fileName: (format) => ({ es: 'index.mjs', cjs: 'index.cjs' })[format] ?? `index.${format}.js`,
      },
      // The UMD build runs after the main one and must keep its files
      emptyOutDir: !umd,
      minify: 'terser',
      terserOptions: {
        mangle: {
          keep_classnames: true,
          keep_fnames: true,
        },
      },
      rollupOptions: {
        external: umd ? [] : ['fast-xml-parser'],
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
      alias: {
        '@Http': resolve(__dirname, 'src'),
      },
    },
  };
});
