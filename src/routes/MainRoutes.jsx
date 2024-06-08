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
    { path: '/dashboard', element: <DashboardDefault /> },
    { path: '/dashboard/color', element: <Color /> },
    { path: '/dashboard/shadows', element: <Shadow /> },
    { path: '/dashboard/typography', element: <Typography /> },
    { path: '/dashboard/services', element: <Service /> },
    { path: '/dashboard/sliders', element: <Slider /> },
    { path: '/dashboard/blogs', element: <Blogs /> },
    { path: '/dashboard/teams', element: <Team /> },
    { path: '/dashboard/sample-page', element: <SamplePage /> },
  ]
};

export default MainRoutes;
