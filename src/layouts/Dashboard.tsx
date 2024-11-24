import {  Navigate, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store'
import {  Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from 'antd';
import Icon, {  BellFilled, UserOutlined } from '@ant-design/icons'; 

import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { useState } from 'react';
import Logo from '../components/icons/logo';
import Home from '../components/icons/Home';
import { foodIcon } from '../components/icons/FoodIcon';
import BasketIcon from '../components/icons/BasketIcon';
import GiftIcon from '../components/icons/GiftIcon';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api';
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
  const { logout: logoutFromStore} = useAuthStore();
  const {mutate: logoutMutate } = useMutation({
  mutationKey: ['logout'],
  mutationFn: logout,
  onSuccess: async () => {
    logoutFromStore();
    // return;
  }
  });
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
      <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
        <Sider 
        theme='light'
        collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="logo">
            <Logo/>
            </div>
          <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Header style={{ paddingLeft: '16px', paddingRight: '16px', background: colorBgContainer}}>
          <Flex gap="middle" align="start" justify='space-between'>
            <Badge text={ user.role === 'admin' ? 'You are an admin' : user.tenant?.name} status='success'/>
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled/>
               
                </Badge>
                   <Dropdown menu={{ items: [
                    { key: 'logout', label: 'Logout', onClick:() => logoutMutate(),}
                  ] }} placement='bottomRight'>
                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>

                  </Dropdown>
              </Space>
          </Flex>
          </Header>
            <Content style={{margin: '0 16px'}}>
          <Outlet/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Fullstack test application       
        </Footer>
        </Layout>
      
        {/* <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
            <Content style={{ margin: '0 16px' }}>
            <Outlet/>

            </Content>
          
        </Layout> */}
      </Layout>      
    </div>
  )
}

export default Dashboard