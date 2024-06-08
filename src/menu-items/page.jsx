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
      url: '/admin/service',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'blogs',
      title: 'Blogs',
      type: 'item',
      url: '/admin/blogs',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'sliders',
      title: 'Careers',
      type: 'item',
      url: '/admin/careers',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'teams',
      title: 'Teams',
      type: 'item',
      url: '/admin/teams',
      icon: icons.LoginOutlined,
      target: true
    }
  ]
};

export default pages;
