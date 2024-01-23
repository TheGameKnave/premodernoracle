import Vue from 'vue'
import App from './app'
import VueRouter from 'vue-router'

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = false

// Register components for Vue Router.
Vue.use(VueRouter)

// Create the router
const router = new VueRouter({
  // Use the HTML5 history API, so that routes look normal
  // (e.g. `/about`) instead of using a hash (e.g. `/#/about`).
  mode: 'history',
  // Define the frontend routes.
  routes: [
    {
      path: '/',
      name: 'home',
      // Use async components for routes, speeding up initial
      // page loads by minimizing the bundle size.
      component: () => import('./views/home'),

    },

    // ---
    // Handle 404s
    // ---

    // Define the 404 page.
    {
      path: '/404',
      name: '404',
      component: require('./views/_404').default,
    },
    // Redirect any unmatched routes to the 404 page.
    {
      path: '*',
      redirect: '404',
    },
  ],
})

// Initialize and mount the frontend.
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
