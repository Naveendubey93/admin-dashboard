import { Breadcrumb, Button, Drawer, Space, Table, Form } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import TenantsFilter from './TenantsFilter';
import { createTenant, getTenants } from '../../http/api';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TenantForm from './forms/TenantForm';
import { CreateTenantData, FieldData } from '../../types';
import { debounce } from 'lodash';
import { PER_PAGE } from '../constants';

// Main Component
const Tenants = () => {
  const [form] = Form.useForm();
  const [TenantFilterForm] = Form.useForm();
  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = React.useState<{
    perPage: number;
    currentPage: number;
    q?: string;
  }>({
    perPage: PER_PAGE,
    currentPage: 1,
    q: '',
  });

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { user } = useAuthStore();

  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tenants', queryParams],
    queryFn: () => {
      const filterdParams = Object.fromEntries(Object.entries(queryParams).filter((Item) => !!Item[1]));
      const queryString = new URLSearchParams(
        filterdParams as unknown as Record<string, string>
      ).toString();
      return getTenants(queryString)
        .then((res) => res.data)
        .catch((error) => {
          console.error('Error fetching tenants: ', error);
          throw error;
        });
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ['tenant'],
    mutationFn: (data: CreateTenantData) => createTenant(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setDrawerOpen(false);
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    tenantMutate(form.getFieldsValue());
    form.resetFields();
  };

  const debounceQueryParams = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const onFIlterChange = (changedValue: FieldData[]) => {
    const changedFilterFileds = changedValue.reduce((acc: Record<string, unknown>, field) => {
      if (field.value !== undefined && field.value !== null) {
        acc[field.name] = field.value;
      }
      return acc;
    }, {});

    if ('q' in changedFilterFileds) {
      debounceQueryParams(changedFilterFileds.q as string | undefined);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFileds,
      }));
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const columns = [
    {
      title: 'S.No',
      key: 'index',
      render: (_: unknown, __: unknown, index: number) =>
        (queryParams.currentPage - 1) * queryParams.perPage + index + 1,
    },
    // {
    //   title: 'Id',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <>
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          {
            title: <Link to="/dashboard">Dashboard</Link>,
          },
          {
            title: 'Tenants',
          },
        ]}
      />

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}

      <Form form={TenantFilterForm} onFieldsChange={onFIlterChange}>
        <TenantsFilter>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
            Add Tenant
          </Button>
        </TenantsFilter>
      </Form>

      <Table
        columns={columns}
        dataSource={tenants?.data || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          total: tenants?.count,
          onChange: (page, pageSize) => {
            setQueryParams((prev) => ({
              ...prev,
              currentPage: page,
              perPage: pageSize,
            }));
          },
        }}
      />

      <Drawer
        title="Create Tenant"
        width={720}
        destroyOnClose={true}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={onHandleSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <TenantForm />
        </Form>
      </Drawer>
    </>
  );
};

export default Tenants;
