import {
  Breadcrumb, Button, Drawer, Space, Table, theme, Form, Spin, Flex
} from 'antd';
import {
  LoadingOutlined, PlusOutlined, RightOutlined
} from '@ant-design/icons';
import {
  Link, Navigate
} from 'react-router-dom';
import {
  keepPreviousData, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import {
  createUser, getUsers, updateUser
} from '../../http/api';
import {
  CreateUserData, FieldData, User
} from '../../types';
import { useAuthStore } from '../../store';
import UsersFilter from './UsersFilter';
import React from 'react';
import UserForm from './forms/UserForm';
import { PER_PAGE } from '../constants';
import { debounce } from 'lodash';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  {
    title: 'Restaurant',
    dataIndex: 'tenant',
    key: 'tenant',
    render: (_text: string, record: User) => <div>{record.tenant?.name}</div>
  }
];

export const Users = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [currentEditingUser, setCurrentEditingUser] = React.useState<User | null>(null);
  const queryClient = useQueryClient();
  const { token: { colorBgLayout } } = theme.useToken();

  const [queryParams, setQueryParams] = React.useState<{
    perPage: number;
    currentPage: number;
    q?: string;
    role?: string;
  }>({
    perPage: PER_PAGE,
    currentPage: 1,
    q: undefined,
    role: undefined
  });

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (currentEditingUser) {
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id
      });
      setDrawerOpen(true);
    } else {
      form.resetFields();
    }
  }, [currentEditingUser, form]);

  const { data: users, isFetching, isError, error } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(Object.entries(queryParams).filter((Item) => !!Item[1]));
      const queryString = new URLSearchParams(
        filteredParams as Record<string, string>
      ).toString();
      return getUsers(queryString)
        .then((res) => res.data)
        .catch((err) => {
          console.error('Error fetching users:', err);
          throw err;
        });
    },
    placeholderData: keepPreviousData
  });

  const createUserMutation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (data: CreateUserData) => {
      const res = await createUser(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const updateUserMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (data: CreateUserData & { id: string }) => {
      const res = await updateUser(data, data.id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleFormSubmit = async () => {
    const isEditMode = !!currentEditingUser;
    try {
      await form.validateFields();
    } catch (error) {
      console.error("Form validation failed:", error);
      return;
    }

    const formData = form.getFieldsValue();

    if (isEditMode && currentEditingUser) {
      updateUserMutation.mutate({...formData, id: currentEditingUser.id});
    } else {
      createUserMutation.mutate(formData);
      console.log("Creating New User");
    }

    form.resetFields();
    setDrawerOpen(false);
    setCurrentEditingUser(null);

  };

  const debounceQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  React.useEffect(() => {
    return () => {
      debounceQUpdate.cancel();
    };
  }, [debounceQUpdate]);

  const onFilterChange = (changedValue: FieldData[]) => {
    const changedFields = changedValue.reduce((acc: Record<string, unknown>, field) => {
      if (field.value !== undefined && field.value !== null) {
        acc[field.name] = field.value;
      }
      return acc;
    }, {});

    if ('q' in changedFields) {
      debounceQUpdate(changedFields.q as string | undefined);
    } else {
      setQueryParams((prev) => ({ ...prev, ...changedFields }));
    }
  };

  const { user } = useAuthStore();

  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: 'Users' }
          ]}
        />
        {isFetching && (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            size="small"
          />
        )}
        {isError && <div>{error?.message || 'An error occurred'}</div>}
      </Flex>

      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <UsersFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </UsersFilter>
      </Form>

      <Table
        columns={[
          ...columns,
          {
            title: 'Actions',
            key: 'actions',
            render: (_text: string, record: User) => (
              <Button type="link" onClick={() => setCurrentEditingUser(record)}>
                Edit
              </Button>
            )
          }
        ]}
        dataSource={users?.users || []}
        rowKey="id"
        pagination={{
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          total: users?.count || 0,
          onChange: (page) =>
            setQueryParams((prev) => ({ ...prev, currentPage: page })),
          showTotal: (total, range: number[]) =>
            `Showing ${range[0]} - ${range[1]} of Total ${total} users`
        }}
      />

      <Drawer
        title={currentEditingUser ? 'Edit User' : 'Create User'}
        width={720}
        destroyOnClose
        style={{ background: colorBgLayout }}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setCurrentEditingUser(null);
        }}
        extra={
          <Space>
            <Button onClick={() => {
              setDrawerOpen(false);
              setCurrentEditingUser(null);
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              type="primary"
              icon={<PlusOutlined />}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <UserForm isEditMode={!!currentEditingUser} />
        </Form>
      </Drawer>
    </Space>
  );
};
