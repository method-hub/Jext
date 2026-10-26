import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

/**
 * `vite build` writes the ES module, CommonJS and types; `vite build --mode umd` writes the UMD file for a
 * `<script>` tag (unpkg, jsdelivr). The package has no dependencies, so both builds bundle the same code.
 */
export default defineConfig(({ mode }) => {
  const umd = mode === 'umd';

  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'index.ts'),
        name: 'JextCollection',
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
        '@Collection': resolve(__dirname, 'src'),
      },
    },
  };
});
