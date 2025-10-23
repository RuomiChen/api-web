import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
html: {
    title: 'MiChen Open API',
    favicon: './public/logo.svg',
    appIcon: {
      name: 'MiChen Open API',
      icons: [
        { src: './public/logo.svg' },
      ],
    },
  },
    output: {
    // 请将 <REPO_NAME> 替换为仓库的名称。
    // 比如 "/my-project/"
    assetPrefix: '/',
  },
  plugins: [pluginVue()],
   performance: {
    removeConsole: true, // 移除 console
  },
  tools: {
    terser: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: {
        toplevel: true,
      },
    },
  },
});
