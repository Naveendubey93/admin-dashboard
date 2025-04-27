import { Breadcrumb, Button, Drawer, Space, Table } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import TenantsFilter from  './TenantsFilter';
import { getTenants } from '../../http/api';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { useQuery } from '@tanstack/react-query';


const columns= [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  }
];



const Tenants = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const {
    data: tenants,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => {
      return getTenants()
        .then((res) => {
         return res.data?.data;       // Fix here if data is wrapped
        })
        .catch((error) => {
          console.error("Error fetching tenants: ", error);
          throw error;  // Re-throw the error so that `isError` can be set to true
        });
    },
  });
  const { user } = useAuthStore();

  if(user?.role !== 'admin') {
    return <Navigate to='/' />;
  }
  return (
    <><>
      <Breadcrumb separator={<RightOutlined />}
        items={[
          {
            title: <Link to='/dashboard'>Dashboard</Link>,
          },
          {
            title: 'Tenants',
          }
        ]} />
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}

      <TenantsFilter onFilterChange={(filterName: string, filterValue: string) => {
        console.log({ filterName, filterValue });
      } }>
        <Button type='primary' icon={<PlusOutlined />}
          onClick={() => setDrawerOpen(true)}
        >Add Tenant</Button>
      </TenantsFilter>
      <Table columns={columns} dataSource={tenants} loading={isLoading} rowKey="id" />

      <Drawer title="Create Restaurant" width={720} destroyOnClose={true} placement="right" onClose={() => setDrawerOpen(false)} open={drawerOpen} extra={<Space>
        <Button>Cancel</Button>
        <Button type="primary">Submit</Button>
      </Space>}>
        <p>Form content goes here</p>
      </Drawer>
    </><Table /></>
  )
}

export default Tenants