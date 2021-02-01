import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', redirect: '/edit', exact: true },
    { path: '/edit', component: '@/pages/edit', exact: true },
    { path: '/preview', component: '@/pages/preview', exact: true },
  ],
});
