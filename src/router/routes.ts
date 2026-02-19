export default [
  {
    path: '/',
    name: 'Home',
    meta: {
      layout: 'wide'
    },
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    meta: {
      layout: 'auth',
      noAuthRequired: true
    },
    component: () => import('@/views/Auth/CreateAccount.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    meta: {
      layout: 'auth',
      noAuthRequired: true
    },
    component: () => import('@/views/Auth/EmailSignUp.vue')
  },
  {
    path: '/signin',
    name: 'SignIn',
    meta: {
      layout: 'auth',
      noAuthRequired: true
    },
    component: () => import('@/views/Auth/EmailSignIn.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    meta: {
      layout: 'auth',
      noAuthRequired: true
    },
    component: () => import('@/views/Auth/ResetPassword.vue')
  },
  {
    path: '/new-password',
    name: 'NewPassword',
    meta: {
      layout: 'auth'
    },
    component: () => import('@/views/Auth/NewPassword.vue')
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    meta: {
      layout: 'auth',
      requiresAuth: true
    },
    component: () => import('@/views/Auth/ChangePassword.vue')
  },
  {
    path: '/change-email',
    name: 'ChangeEmail',
    meta: {
      layout: 'auth',
      requiresAuth: true
    },
    component: () => import('@/views/Auth/ChangeEmail.vue')
  },
  {
    path: '/transactions',
    name: 'Transactions',
    meta: {
      layout: 'narrow',
      requiresAuth: true
    },
    component: () => import('@/views/Transactions.vue')
  },
  {
    path: '/funds',
    name: 'Funds',
    meta: {
      layout: 'narrow'
    },
    component: () => import('@/views/Funds.vue')
  },
  {
    path: '/payment/mobile',
    name: 'MobilePayment',
    meta: {
      layout: 'empty'
    },
    component: () => import('@/views/MobilePayment.vue')
  },
  {
    path: '/numbers',
    name: 'Numbers',
    meta: {
      layout: 'narrow',
      requiresAuth: true
    },
    component: () => import('@/views/ActiveNumbers.vue')
  },
  {
    path: '/history',
    name: 'History',
    meta: {
      layout: 'narrow',
      requiresAuth: true
    },
    component: () => import('@/views/NumbersHistory.vue')
  },
  {
    path: '/help',
    name: 'Help',
    meta: {
      layout: 'narrow'
    },
    component: () => import('@/views/Help/FAQ.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    meta: {
      layout: 'narrow',
      requiresAuth: true
    },
    component: () => import('@/views/Help/Reports.vue')
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    meta: {
      layout: 'narrow',
      requiresAuth: true
    },
    component: () => import('@/views/Help/ContactUs.vue')
  },
  {
    path: '/privacy-policy',
    name: 'Privacy',
    meta: {
      layout: 'default'
    },
    component: () => import('@/views/Privacy.vue')
  },
  {
    path: '/terms-of-service',
    name: 'Terms',
    meta: {
      layout: 'default'
    },
    component: () => import('@/views/Terms.vue')
  },
  {
    path: '/deeplink',
    name: 'DeepLink',
    meta: {
      layout: 'empty'
    },
    component: () => import('@/views/DeepLink.vue')
  },
  {
    path: '/auth/tg/mobile',
    name: 'TgMobileAuth',
    meta: {
      layout: 'empty'
    },
    component: () => import('@/views/Auth/TgMobile.vue')
  },
  {
    path: '/legal',
    name: 'Legal',
    meta: {
      layout: 'empty'
    },
    component: () => import('@/views/Legal.vue')
  },
  {
    path: '/variables',
    name: 'Variables',
    meta: {
      layout: 'default'
    },
    component: () => import('@/views/Variables.vue')
  },
  {
    path: '/api',
    name: 'API',
    meta: {
      layout: 'default'
    },
    component: () => import('@/views/Api.vue')
  }
]
