import {  Navigate, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store'
import {  Layout, Menu, theme } from 'antd';
import Icon, {  UserOutlined } from '@ant-design/icons'; 

import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { useState } from 'react';
import Logo from '../components/icons/logo';
import Home from '../components/icons/Home';
import { foodIcon } from '../components/icons/FoodIcon';
import BasketIcon from '../components/icons/BasketIcon';
import GiftIcon from '../components/icons/GiftIcon';
const items= [
  {
    key: '/',
    icon: <Icon component={Home}/> ,
    label: <NavLink to="/">Home</NavLink>,
  },
  {
    key: '/users',
    icon: <UserOutlined/>,
    label: <NavLink to="/users">User</NavLink>,
  },
  {
    key: '/restaurants',
    icon: <Icon component={foodIcon}/>,
    label: <NavLink to="/restaurants">Restaurants</NavLink>,
  },
  {
    key: '/products',
    icon: <Icon component={BasketIcon}/>,
    label: <NavLink to="/products">Home</NavLink>,
  },
    {
    key: '/promos',
    icon: <Icon component={GiftIcon}/>,
    label: <NavLink to="/promos">Home</NavLink>,
  },

];
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


const { user } = useAuthStore();
if(!user) {
  return <Navigate to="/auth/login" replace={true} />;
}

  return (
    <div>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
      theme='light'
      collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">
          <Logo/>
          </div>
        <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
        <Outlet/>

        </Content>
        <Footer style={{ textAlign: 'center' }}>
            Fullstack test application       
         </Footer>
      </Layout>
    </Layout>      
    </div>
  )
}

export default Dashboard