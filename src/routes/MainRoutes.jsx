import { lazy } from 'react';
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
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

const MainRoutes = {
  path: '/admin',
  element: <Dashboard />,
  children: [
    { path: '/admin/dashboard', element: <DashboardDefault /> },
    { path: '/admin/color', element: <Color /> },
    { path: '/admin/shadows', element: <Shadow /> },
    { path: '/admin/typography', element: <Typography /> },
    { path: '/admin/service', element: <Service /> },
    { path: '/admin/careers', element: <Slider /> },
    { path: '/admin/blogs', element: <Blogs /> },
    { path: '/admin/teams', element: <Team /> },
    { path: '/admin/sample-page', element: <SamplePage /> },
  ]
};

export default MainRoutes;
