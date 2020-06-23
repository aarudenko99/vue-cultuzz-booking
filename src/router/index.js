import Vue from 'vue';
import VueRouter from 'vue-router';
import StorageService from '@/services/storage.service';

// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    // component: Home,
    redirect: { name: 'calendar' },
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Welcome',
      public: true,
      guestOnly: true,
    },
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: 'Sign Up',
      sideBar: false,
      public: true,
      guestOnly: true,
    },
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Register.vue'),
  },
  {
    path: '/password/email',
    name: 'password.email',
    meta: {
      title: 'Forgot Password',
      public: true,
      guestOnly: true,
    },
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/ForgotPassword.vue'),
  },
  {
    path: '/password/reset',
    name: 'password.reset',
    meta: {
      title: 'Reset Password',
      public: true,
      guestOnly: true,
    },
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/ResetPassword.vue'),
  },
  {
    path: '/email/verify/:id?/:hash?',
    name: 'verification.notice',
    meta: {
      sideBar: false,
      title: 'Verification',
      centered: true,
    },
    component: () => import(/* webpackChunkName: "user" */ '@/views/User/VerifyEmailNotice.vue'),
  },
  {
    path: '/details',
    name: 'details',
    meta: {
      centered: true,
    },
    component: () => import(/* webpackChunkName: "user" */ '@/views/User/Details.vue'),
  },
  {
    path: '/calendar',
    name: 'calendar',
    meta: {
      title: 'Calendar',
    },
    component: () => import(/* webpackChunkName: "calendar" */ '@/views/Calendar.vue'),
  },
  {
    path: '/reservations',
    name: 'reservations',
    meta: {
      title: 'Reservations',
    },
    component: () => import(/* webpackChunkName: "reservations" */ '@/views/Reservations.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'exact-active',
  linkActiveClass: 'active',
  routes,
});

export default router;

const initialRoute = 'calendar';
export { initialRoute, router };

let initialUserCheckDone = false;

let $store = null;
const checkLoggedIn = () => new Promise((resolve) => {
  Vue.nextTick(async () => {
    // save $store for future use
    $store = router.app.$store;
    await $store.dispatch('user/getUser', false);
    resolve();
  });
});

router.beforeEach(async (to, from, next) => {
  if (!initialUserCheckDone) {
    await checkLoggedIn();
    initialUserCheckDone = true;
  }

  // clear server-validation states in store modules
  $store.dispatch('clearErrors');

  const { title, sideBar, centered } = to.meta;
  $store.commit('pageTitle', title);
  $store.commit('sidebar', sideBar);
  $store.commit('centered', centered);

  // By default all routes are protected for users only
  const isGuestOnly = to.matched.some((r) => r.meta.guestOnly);
  const isPublic = to.matched.some((r) => r.meta.public);
  const isLoggedIn = !!StorageService.getUser();

  // prevent guests from visiting logged-in pages
  if (!isPublic && !isLoggedIn) {
    const redirect = to.fullPath;
    const toLogin = { name: 'login' };
    if (redirect !== '/') {
      toLogin.query = { redirect };
    }
    return next(toLogin);
  }

  // prevent logged-in users from visiting guests-only pages
  if (isLoggedIn && isGuestOnly) {
    return next({ name: initialRoute });
  }

  if (!isLoggedIn) {
    return next();
  }

  // check conditions that prevents users from continue
  // until they fill some information or make some actions
  // ---
  // initial check has been done already, we can use $store here
  // const { $store } = router.app;

  // check for verified email
  if (!$store.getters['user/emailVerified']) {
    if (from.name === 'verification.notice') {
      return next(false);
    }
    if (to.name !== 'verification.notice') {
      return next({ name: 'verification.notice' });
    }
    return next();
  }
  if (to.name === 'verification.notice') {
    return next({ name: initialRoute });
  }
  // ***

  // check for filled information
  if (!$store.getters['user/requiredFilled']) {
    if (from.name === 'details') {
      return next(false);
    }
    if (to.name !== 'details') {
      return next({ name: 'details' });
    }
    return next();
  }
  if (to.name === 'details') {
    return next({ name: initialRoute });
  }
  // ***

  return next();
});

// router.beforeResolve((to, from, next) => {
//   const { title, sideBar, centered } = to.meta;
//   // const { $store } = router.app;
//   $store.commit('pageTitle', title);
//   $store.commit('sidebar', sideBar);
//   $store.commit('centered', centered);
//   next();
// });
