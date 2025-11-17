import { readFileSync } from 'fs'
import { defineConfig } from 'rollup'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

export default defineConfig({
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    }
  ],
  external: [],
  plugins: [
    // No additional plugins needed for pure JavaScript
  ],
})
