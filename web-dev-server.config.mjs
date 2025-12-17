import { esbuildPlugin } from '@web/dev-server-esbuild'

export default {
  watch: true,
  appIndex: 'index.html',
  nodeResolve: {
    exportConditions: ['development'],
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: './tsconfig.json',
    }),
  ],
}
