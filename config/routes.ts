export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/workplace',
              },
              {
                path: '/workplace',
                name: '工作台',
                icon: 'dashboard',
                component: './Workplace',
              },
              {
                path: '/candidate/:id',
                hideInMenu: true,
                component: './CandidateDetail',
              },
              {
                path: '/jobs',
                name: '职位管理',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
