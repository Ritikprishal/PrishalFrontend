// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Features',
  type: 'group',
  children: [
    
    {
      id: 'service',
      title: 'Services',
      type: 'item',
      url: '/dashboard/service',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'blogs',
      title: 'Blogs',
      type: 'item',
      url: '/dashboard/blogs',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'sliders',
      title: 'Careers',
      type: 'item',
      url: '/dashboard/careers',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'teams',
      title: 'Teams',
      type: 'item',
      url: '/dashboard/teams',
      icon: icons.LoginOutlined,
      target: true
    }
  ]
};

export default pages;
