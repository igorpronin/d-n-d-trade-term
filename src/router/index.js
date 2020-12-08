import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/market',
  },
  {
    path: '/market',
    name: 'Market',
    component: () => import(/* webpackChunkName: "market" */ '../views/Market.vue'),
  },
  {
    path: '/blockchainexplorer',
    name: 'News',
    component: () => import('../views/BlockchainExplorer.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
