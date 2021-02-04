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
                redirect: '/candidates',
              },
              {
                path: '/candidates',
                name: '候选人管理',
                icon: 'contacts',
                component: './Candidates',
              },
              {
                path: '/candidate/:id',
                hideInMenu: true,
                component: './CandidateDetail',
              },
              {
                path: '/jobs',
                name: '职位管理',
                icon: 'appstore',
                component: './Jobs',
                authority: ['admin'],
              },
              // {
              //   path: '/interviewers',
              //   name: '面试官管理',
              //   icon: 'team',
              //   component: './Interviewers',
              //   authority: ['admin'],
              // },
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
