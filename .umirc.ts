import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index', exact: true },
    { path: '/preview', component: '@/pages/preview', exact: true },
  ],
});
