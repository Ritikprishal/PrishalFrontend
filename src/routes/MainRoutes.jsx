import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const Service = Loadable(lazy(() => import('pages/services/index')));
const Slider = Loadable(lazy(() => import('pages/sliders/index')));
const Blogs = Loadable(lazy(() => import('pages/blogs/index')));
const Team = Loadable(lazy(() => import('pages/teams/index')));


// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: <Dashboard />,
  children: [
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: '/dashboard/service',
      element: <Service />
    },
    {
      path: '/dashboard/careers',
      element: <Slider />
    },
    {
      path: '/dashboard/blogs',
      element: <Blogs />
    },
    {
      path: '/dashboard/teams',
      element: <Team />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
