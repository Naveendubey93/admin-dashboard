import { Breadcrumb, Button, Drawer, Space, Table, Form } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import TenantsFilter from  './TenantsFilter';
import { createTenant, getTenants } from '../../http/api';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TenantForm from './forms/TenantForm';
import { CreateTenantData } from '../../types';

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
    const [ form ]   =  Form.useForm();
  
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

const queryClient = useQueryClient();
const { mutate: tenantMutate } = useMutation({
  mutationKey: ['tenant'],
  mutationFn: (data: CreateTenantData) => createTenant(data).then((res) => res.data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tenants'] });
    setDrawerOpen(false);
  },
})

const onHandleSubmit = () => {
console.log('Form submitted', form.getFieldsValue());
form.validateFields();
tenantMutate(form.getFieldsValue());
console.log('Form values:', form.getFieldsValue());
form.resetFields();

}

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
        <Button onClick={onHandleSubmit} type="primary">Submit</Button>
      </Space>}>
        {/* <p>Form content goes here</p> */}
        <Form layout='vertical' style={{ width: '100%' }}  form={form}>
          <TenantForm/>
        </Form>
      </Drawer>
    </><Table /></>
  )
}

export default Tenants
            // <Button onClick={onHandleSubmit} type='primary' icon={<PlusOutlined/>}
